import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { api } from "../api.js"; // axios instance with baseURL

// helpers
const ms = (m) => m * 60 * 1000;

export default function QuizPlayer({ quizId, studentId, onDone }) {
  const [loading, setLoading] = useState(true);
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({}); // key: q.idx, value: chosenIndex
  const [deadline, setDeadline] = useState(null);
  const [now, setNow] = useState(Date.now());

  // tick each second for timer
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  // load quiz (shuffled from server)
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const r = await api.get(`/api/quizzes/${quizId}/take`, { params: { studentId }});
        const data = r.data?.data;
        setQuiz(data);
        // compute deadline
        const duration = (data?.durationMins || 30);
        setDeadline(Date.now() + ms(duration));
      } catch (e) {
        console.error(e);
        toast.error(e?.response?.data?.message || "Failed to load quiz");
      } finally {
        setLoading(false);
      }
    })();
  }, [quizId, studentId]);

  const remaining = Math.max(0, (deadline || 0) - now);
  const mm = Math.floor(remaining / 60000);
  const ss = Math.floor((remaining % 60000) / 1000);

  const select = (idx, choice) => {
    setAnswers((a) => ({ ...a, [idx]: choice }));
  };

  const submit = async () => {
    try {
      const payload = {
        studentId,
        answers: Object.entries(answers).map(([idx, chosenIndex]) => ({
          idx: Number(idx),
          chosenIndex: Number(chosenIndex),
        })),
      };
      const r = await api.post(`/api/quizzes/${quizId}/submit`, payload);
      const { score, maxScore } = r.data?.data || {};
      toast.success(`✅ Submitted! You scored ${score}/${maxScore}`);
      onDone?.({ score, maxScore });
    } catch (e) {
      console.error(e);
      toast.error(e?.response?.data?.message || "Submit failed");
    }
  };

  // auto submit on time up
  useEffect(() => {
    if (!deadline) return;
    if (remaining === 0 && quiz) submit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remaining, deadline, quiz]);

  if (loading) return <div className="p-6">Loading quiz…</div>;
  if (!quiz) return <div className="p-6">Quiz not available.</div>;

  return (
    <div className="max-w-3xl mx-auto p-4 bg-white rounded-2xl shadow">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold">{quiz.title}</h2>
          <div className="text-sm text-gray-500">{quiz.subject} • {quiz.batch}</div>
        </div>
        <div className={`px-3 py-1 rounded-full text-white ${remaining < 60000 ? "bg-red-500" : "bg-blue-600"}`}>
          ⏱ {String(mm).padStart(2,"0")}:{String(ss).padStart(2,"0")}
        </div>
      </div>

      <ol className="space-y-4">
        {quiz.questions.map((q, i) => (
          <li key={q.idx} className="border rounded-xl p-4">
            <div className="font-medium mb-2">{i + 1}. {q.text}</div>
            <div className="grid gap-2">
              {q.options.map((opt, oi) => {
                const sel = answers[q.idx];
                return (
                  <label key={oi} className={`flex items-center gap-2 p-2 rounded border cursor-pointer ${sel === oi ? "bg-blue-50 border-blue-300" : "bg-white"}`}>
                    <input
                      type="radio"
                      name={`q-${q.idx}`}
                      checked={sel === oi}
                      onChange={() => select(q.idx, oi)}
                    />
                    <span>{opt.text}</span>
                  </label>
                );
              })}
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-6 text-right">
        <button
          onClick={submit}
          className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
        >
          Submit
        </button>
      </div>
    </div>
  );
}

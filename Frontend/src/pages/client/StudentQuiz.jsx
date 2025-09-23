import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const backendURL = import.meta.env.VITE_BACKEND_URL;
axios.get(`${backendURL}/api/quizzes/${quizId}/take`);

export default function StudentQuiz({ quizId }) {
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load quiz
  useEffect(() => {
    async function fetchQuiz() {
      try {
        const res = await axios.get(`${backendURL}/api/quizzes/${quizId}/take`);
        setQuiz(res.data.data);
        setLoading(false);
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load quiz");
        setLoading(false);
      }
    }
    fetchQuiz();
  }, [quizId]);

  function handleOptionChange(qIdx, optIdx) {
    setAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
  }

  async function handleSubmit() {
    try {
      const payload = {
        answers: Object.entries(answers).map(([idx, chosenIndex]) => ({
          idx: Number(idx),
          chosenIndex,
        })),
      };

      const res = await axios.post(
        `${backendURL}/api/quizzes/${quizId}/submit`,
        payload
      );

      setResult(res.data.data);
      setSubmitted(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Submit failed");
    }
  }

  if (loading) return <div className="p-6">Loading quiz...</div>;
  if (!quiz) return <div className="p-6">No quiz found.</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">{quiz.title}</h1>
      <p className="text-gray-600 mb-6">
        Subject: {quiz.subject} | Total Marks: {quiz.totalMarks}
      </p>

      {submitted ? (
        <div className="bg-green-100 p-6 rounded-lg shadow-md text-center">
          <h2 className="text-xl font-semibold text-green-800 mb-2">
            Quiz Submitted!
          </h2>
          <p className="text-lg">
            Your Score:{" "}
            <span className="font-bold">
              {result.score} / {result.maxScore}
            </span>
          </p>
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          {quiz.questions.map((q, qIdx) => (
            <div
              key={qIdx}
              className="mb-6 p-4 border rounded-lg shadow-sm bg-white"
            >
              <p className="font-medium mb-2">
                Q{qIdx + 1}. {q.text} ({q.marks} mark)
              </p>
              <div className="space-y-2">
                {q.options.map((opt, optIdx) => (
                  <label
                    key={optIdx}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name={`q-${q.idx}`}
                      value={optIdx}
                      checked={answers[q.idx] === optIdx}
                      onChange={() => handleOptionChange(q.idx, optIdx)}
                      className="h-4 w-4 text-blue-600"
                    />
                    <span>{opt.text}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}

          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700"
          >
            Submit Quiz
          </button>
        </form>
      )}
    </div>
  );
}

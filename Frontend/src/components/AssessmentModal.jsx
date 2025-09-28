import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Plus, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { createQuiz, updateQuiz } from "../api.js";

export default function AssessmentModal({ open, onClose, initial }) {
  const [form, setForm] = useState({
    title: "",
    type: "Quiz",
    schedule: new Date().toISOString().slice(0, 16),
    duration: 30,
    totalMarks: 10,
    batch: "2025 A/L",
    published: false,
    desc: "",
    questions: [{ text: "", options: ["", "", "", ""], correctIndex: 0 }],
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!open) return;
    if (initial) {
      const sched =
        initial.schedule && typeof initial.schedule === "string"
          ? initial.schedule.slice(0, 16)
          : new Date().toISOString().slice(0, 16);
      setForm({
        title: initial.title || "",
        type: initial.type || "Quiz",
        schedule: sched,
        duration: Number(initial.duration ?? 30),
        totalMarks: Number(initial.totalMarks ?? 10),
        batch: initial.batch || "2025 A/L",
        published: !!initial.published,
        desc: initial.desc || "",
        questions:
          initial.questions?.map((q) => ({
            text: q.text || "",
            options: (q.options || []).map((o) =>
              typeof o === "string" ? o : o.text || ""
            ),
            correctIndex: Number(q.correctIndex ?? 0),
          })) || [{ text: "", options: ["", "", "", ""], correctIndex: 0 }],
      });
    } else {
      setForm({
        title: "",
        type: "Quiz",
        schedule: new Date().toISOString().slice(0, 16),
        duration: 30,
        totalMarks: 10,
        batch: "2025 A/L",
        published: false,
        desc: "",
        questions: [{ text: "", options: ["", "", "", ""], correctIndex: 0 }],
      });
    }
    setErrors({});
  }, [open, initial]);

  if (!open) return null;

  const setQ = (i, updater) =>
    setForm((f) => {
      const qs = [...f.questions];
      qs[i] = typeof updater === "function" ? updater(qs[i]) : updater;
      return { ...f, questions: qs };
    });

  const addQ = () =>
    setForm((f) => ({
      ...f,
      questions: [...f.questions, { text: "", options: ["", "", "", ""], correctIndex: 0 }],
    }));

  const removeQ = (i) =>
    setForm((f) => ({
      ...f,
      questions: f.questions.filter((_, idx) => idx !== i),
    }));

  const validateForm = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = "Title is required";
    if (!form.schedule) newErrors.schedule = "Schedule date/time is required";
    if (form.duration <= 0) newErrors.duration = "Duration must be greater than 0";
    if (form.totalMarks <= 0) newErrors.totalMarks = "Total marks must be greater than 0";

    form.questions.forEach((q, i) => {
      if (!q.text.trim()) newErrors[`q-${i}`] = "Question text is required";
      q.options.forEach((opt, oi) => {
        if (!opt.trim()) newErrors[`q-${i}-opt-${oi}`] = "Option cannot be empty";
      });
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const save = async () => {
    if (!validateForm()) {
      toast.error("Please fix the errors before saving");
      return;
    }

    try {
      if (!form.title.trim()) return toast.error("Title is required");
      if (!form.questions.length) return toast.error("Add at least one question");

      const payload = {
        title: form.title.trim(),
        type: form.type,
        batch: form.batch,
        schedule: new Date(form.schedule).toISOString(),
        duration: Number(form.duration),
        totalMarks: Number(form.totalMarks),
        published: !!form.published,
        desc: form.desc || "",
        questions: form.questions.map((q) => ({
          text: q.text,
          options: q.options.map((t) => ({ text: t })),
          correctIndex: Number(q.correctIndex ?? 0),
        })),
      };

      if (initial?._id) {
        await updateQuiz(initial._id, payload);
        toast.success("Quiz updated ✅");
      } else {
        await createQuiz(payload);
        toast.success("Quiz created ✅");
      }
      onClose?.();
    } catch (e) {
      console.error(e);
      toast.error(e?.response?.data?.message || "Save failed");
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
      {/* overlay */}
      <button
        aria-label="Close overlay"
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />

      {/* wrapper */}
      <div className="absolute inset-0 flex items-start justify-center p-4 sm:p-6">
        <div
          className="
            w-[96%] max-w-4xl bg-white rounded-2xl shadow-lg overflow-hidden
            grid grid-rows-[auto,1fr,auto]
            h-[min(88vh,100dvh-32px)]
          "
        >
          {/* header */}
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <h3 className="text-lg font-semibold">
              {initial ? "Edit Assessment" : "Create Assessment"}
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={addQ}
                className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded bg-blue-600 text-white"
              >
                <Plus size={16} /> Add Question
              </button>
              <button onClick={onClose} className="text-gray-600 hover:text-black" aria-label="Close">
                <X size={20} />
              </button>
            </div>
          </div>

          {/* BODY */}
          <div className="min-h-0 overflow-y-auto overscroll-contain px-6 py-5">
            <div className="grid md:grid-cols-2 gap-5">
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-600">Title *</label>
                  <input
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className={`w-full border rounded-lg px-3 py-2 ${
                      errors.title ? "border-red-500" : ""
                    }`}
                    placeholder="e.g., SQL Joins Quiz"
                  />
                  {errors.title && <p className="text-red-500 text-xs">{errors.title}</p>}
                </div>
                <div>
                  <label className="text-sm text-gray-600">Type *</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2"
                  >
                    <option>Quiz</option>
                    <option>Assignment</option>
                    <option>Practical</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Schedule *</label>
                  <input
                    type="datetime-local"
                    value={form.schedule}
                    onChange={(e) => setForm({ ...form, schedule: e.target.value })}
                    className={`w-full border rounded-lg px-3 py-2 ${
                      errors.schedule ? "border-red-500" : ""
                    }`}
                  />
                  {errors.schedule && <p className="text-red-500 text-xs">{errors.schedule}</p>}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm text-gray-600">Duration (mins)</label>
                    <input
                      type="number"
                      value={form.duration}
                      onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })}
                      className={`w-full border rounded-lg px-3 py-2 ${
                        errors.duration ? "border-red-500" : ""
                      }`}
                    />
                    {errors.duration && <p className="text-red-500 text-xs">{errors.duration}</p>}
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Total Marks</label>
                    <input
                      type="number"
                      value={form.totalMarks}
                      onChange={(e) => setForm({ ...form, totalMarks: Number(e.target.value) })}
                      className={`w-full border rounded-lg px-3 py-2 ${
                        errors.totalMarks ? "border-red-500" : ""
                      }`}
                    />
                    {errors.totalMarks && <p className="text-red-500 text-xs">{errors.totalMarks}</p>}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Batch *</label>
                  <select
                    value={form.batch}
                    onChange={(e) => setForm({ ...form, batch: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2"
                  >
                    <option>2025 A/L</option>
                    <option>2026 A/L</option>
                    <option>2027 A/L</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    id="pub"
                    type="checkbox"
                    checked={form.published}
                    onChange={(e) => setForm({ ...form, published: e.target.checked })}
                  />
                  <label htmlFor="pub" className="text-sm">Publish immediately</label>
                </div>
              </div>

              {/* Questions */}
              <div className="space-y-3">
                <div className="flex items-center justify-between sm:hidden">
                  <div className="font-semibold">Questions</div>
                  <button
                    onClick={addQ}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded bg-blue-600 text-white"
                  >
                    <Plus size={16} /> Add
                  </button>
                </div>

                <div className="hidden sm:block font-semibold">Questions</div>

                {form.questions.map((q, idx) => (
                  <div key={idx} className="border rounded-xl p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">Q{idx + 1}</div>
                      {form.questions.length > 1 && (
                        <button
                          onClick={() => removeQ(idx)}
                          className="text-red-600 hover:bg-red-50 rounded p-1"
                          aria-label={`Remove question ${idx + 1}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                    <input
                      value={q.text}
                      onChange={(e) => setQ(idx, { ...q, text: e.target.value })}
                      className={`w-full border rounded-lg px-3 py-2 ${
                        errors[`q-${idx}`] ? "border-red-500" : ""
                      }`}
                      placeholder="Question text"
                    />
                    {errors[`q-${idx}`] && (
                      <p className="text-red-500 text-xs">{errors[`q-${idx}`]}</p>
                    )}
                    <div className="grid grid-cols-1 gap-2">
                      {q.options.map((opt, oi) => (
                        <label key={oi} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={`q-${idx}`}
                            checked={q.correctIndex === oi}
                            onChange={() => setQ(idx, { ...q, correctIndex: oi })}
                          />
                          <input
                            value={opt}
                            onChange={(e) => {
                              const copy = [...q.options];
                              copy[oi] = e.target.value;
                              setQ(idx, { ...q, options: copy });
                            }}
                            className={`flex-1 border rounded-lg px-3 py-2 ${
                              errors[`q-${idx}-opt-${oi}`] ? "border-red-500" : ""
                            }`}
                            placeholder={`Option ${oi + 1}`}
                          />
                          {errors[`q-${idx}-opt-${oi}`] && (
                            <p className="text-red-500 text-xs">{errors[`q-${idx}-opt-${oi}`]}</p>
                          )}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* footer */}
          <div className="px-6 py-4 border-t bg-white pb-[env(safe-area-inset-bottom)]">
            <div className="flex justify-end gap-3">
              <button onClick={onClose} className="px-4 py-2 rounded-lg bg-white border">Cancel</button>
              <button onClick={save} className="px-4 py-2 rounded-lg bg-blue-600 text-white">Save</button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

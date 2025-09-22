// src/components/QuizSection.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { PlusCircle } from "lucide-react";
import { toast } from "react-hot-toast";
import { useRealtimeStore } from "../utils/rtStore.js";
import AssessmentModal from "./AssessmentModal.jsx";
import { listQuizzes, removeQuiz, toggleQuizPublish } from "../api.js";

export default function QuizSection() {
  const [store, update] = useRealtimeStore();
  const [q, setQ] = useState("");
  const [batch, setBatch] = useState("All Batches");
  const [type, setType] = useState("All");
  const [open, setOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);

  // --- RUN ONCE fetch: prevents /api/quizzes spam ---
  const didFetch = useRef(false);
  useEffect(() => {
    if (didFetch.current) return;
    didFetch.current = true;
    (async () => {
      try {
        const data = await listQuizzes();
        update((s) => ({ ...s, quizzes: data || [] }));
      } catch (e) {
        console.error(e);
        toast.error("Failed to load quizzes");
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Lock body scroll while modal open (and ESC to close)
  useEffect(() => {
    if (!open) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const filtered = useMemo(() => {
    return (store.quizzes || [])
      .filter((x) => batch === "All Batches" || x.batch === batch)
      .filter((x) => type === "All" || x.type === type)
      .filter((x) => x.title?.toLowerCase().includes(q.toLowerCase()));
  }, [store, q, batch, type]);

  const del = async (id) => {
    try {
      await removeQuiz(id);
      update((s) => ({ ...s, quizzes: s.quizzes.filter((x) => x._id !== id) }));
      toast.success("Quiz deleted");
    } catch (e) {
      console.error(e);
      toast.error("Delete failed");
    }
  };

  const togglePublish = async (id) => {
    try {
      const updated = await toggleQuizPublish(id);
      update((s) => ({
        ...s,
        quizzes: s.quizzes.map((x) => (x._id === id ? updated : x)),
      }));
      toast.success(updated.published ? "Published" : "Unpublished");
    } catch (e) {
      console.error(e);
      toast.error("Publish toggle failed");
    }
  };

  return (
    <div className="space-y-4 flex  mt-[90px] flex-col">
      <div className="flex justify-between items-center">
        <div className="text-lg font-semibold">Quizzes & Assessments</div>
        <button
          onClick={() => { setEditItem(null); setOpen(true); }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <PlusCircle size={18} /> Create Assessment
        </button>
      </div>

      {/* filters */}
      <div className="flex flex-wrap gap-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search assessments..."
          className="px-3 py-2 bg-white border rounded-lg"
        />
        <select value={batch} onChange={(e) => setBatch(e.target.value)} className="px-3 py-2 bg-white border rounded-lg">
          <option>All Batches</option><option>2025 A/L</option><option>2026 A/L</option><option>2027 A/L</option>
        </select>
        <select value={type} onChange={(e) => setType(e.target.value)} className="px-3 py-2 bg-white border rounded-lg">
          <option>All</option><option>Quiz</option><option>Assignment</option><option>Practical</option>
        </select>
      </div>

      {/* table */}
      <div className="rounded-2xl bg-white shadow overflow-x-auto">
        <table className="min-w-[900px] w-full">
          <thead className="bg-blue-50">
            <tr className="text-left">
              <th className="p-3">Title</th>
              <th className="p-3">Schedule</th>
              <th className="p-3">Batch</th>
              <th className="p-3">Duration</th>
              <th className="p-3">Published</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((x) => (
              <tr key={x._id} className="border-t">
                <td className="p-3 font-medium">{x.title}</td>
                <td className="p-3">{new Date(x.schedule).toLocaleString()}</td>
                <td className="p-3">{x.batch}</td>
                <td className="p-3">{x.durationMins} mins</td>
                <td className="p-3">
                  <input type="checkbox" checked={!!x.published} onChange={() => togglePublish(x._id)} />
                  <span className="ml-2 text-sm text-gray-500">{x.published ? "Live" : "Draft"}</span>
                </td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <button onClick={() => { setEditItem(x); setOpen(true); }} className="text-blue-600">Edit</button>
                    <button onClick={() => del(x._id)} className="text-red-600">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td className="p-3 text-sm text-gray-500" colSpan={6}>No assessments found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Full background gradient BEHIND the modal (no blocking) */}
      {open && (
        <div className="fixed inset-0 z-[30] pointer-events-none bg-gradient-to-br from-indigo-100 via-sky-50 to-blue-200" />
      )}

      {/* Place modal ABOVE the gradient */}
      <div className={open ? "relative z-[60]" : ""}>
        <AssessmentModal
          open={open}
          onClose={() => setOpen(false)}
          initial={editItem}
        />
      </div>
    </div>
  );
}

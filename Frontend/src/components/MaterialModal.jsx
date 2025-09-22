// src/components/MaterialModal.jsx
import React, { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { writeStore } from "../utils/rtStore.js";

export default function MaterialModal({ open, onClose, initial }) {
  const [form, setForm] = useState({
    title: "",
    type: "Note",
    topic: "",
    week: 1,
    link: "",
    desc: "",
    batch: "2025 A/L",
    year: new Date().getFullYear(),
  });

  useEffect(() => {
    if (initial) {
      setForm({
        title: initial.title ?? "",
        type: initial.type ?? "Note",
        topic: initial.topic ?? "",
        week: initial.week ?? 1,
        link: initial.link ?? "",
        desc: initial.desc ?? "",
        batch: initial.batch ?? "2025 A/L",
        year: initial.year ?? new Date().getFullYear(),
      });
    }
  }, [initial]);

  if (!open) return null;

  const onChange = (k) => (e) =>
    setForm((f) => ({ ...f, [k]: k === "week" || k === "year" ? Number(e.target.value) : e.target.value }));

  const save = () => {
    if (!form.title.trim()) {
      alert("Title is required");
      return;
    }
    writeStore((s) => {
      if (initial?.id) {
        s.materials = s.materials.map((m) => (m.id === initial.id ? { ...m, ...form } : m));
      } else {
        s.materials = [
          ...s.materials,
          { id: "m" + crypto.randomUUID(), createdAt: Date.now(), ...form },
        ];
      }
      return { ...s };
    });
    onClose?.();
  };

  return (
    <div className="fixed inset-0 bg-black/30 grid place-items-center z-50 pt-24">
  <div className="w-[95%] md:w-[1100px] bg-white rounded-2xl shadow p-6">


        {/* Title bar */}
        <div className="flex items-center justify-between px-6 py-5 border-b">
          <h3 className="text-xl font-semibold">Add Learning Material</h3>
          <button onClick={onClose} className="text-blue-600 hover:underline">Close</button>
        </div>

        {/* Form body */}
        <div className="px-6 py-6">
          {/* Title & Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Title *</label>
              <input
                value={form.title}
                onChange={onChange("title")}
                placeholder="e.g., Database Normalization Notes"
                className="w-full rounded-xl border border-blue-100 focus:border-blue-300 focus:ring-2 focus:ring-blue-200 px-4 py-3 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Type *</label>
              <select
                value={form.type}
                onChange={onChange("type")}
                className="w-full rounded-xl border border-blue-100 focus:border-blue-300 focus:ring-2 focus:ring-blue-200 px-4 py-3 outline-none"
              >
                <option>Note</option>
                <option>Slide</option>
                <option>Reading</option>
              </select>
            </div>
          </div>

          {/* Topic & Week */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Topic</label>
              <input
                value={form.topic}
                onChange={onChange("topic")}
                placeholder="e.g., SQL, Networking, OOP"
                className="w-full rounded-xl border border-blue-100 focus:border-blue-300 focus:ring-2 focus:ring-blue-200 px-4 py-3 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Week</label>
              <input
                type="number"
                min={1}
                value={form.week}
                onChange={onChange("week")}
                placeholder="Week 1"
                className="w-full rounded-xl border border-blue-100 focus:border-blue-300 focus:ring-2 focus:ring-blue-200 px-4 py-3 outline-none"
              />
            </div>
          </div>

          {/* Link */}
          <div className="mt-4">
            <label className="block text-sm text-gray-600 mb-1">Link (optional)</label>
            <input
              value={form.link}
              onChange={onChange("link")}
              placeholder="https://..."
              className="w-full rounded-xl border border-blue-100 focus:border-blue-300 focus:ring-2 focus:ring-blue-200 px-4 py-3 outline-none"
            />
          </div>

          {/* Description */}
          <div className="mt-4">
            <label className="block text-sm text-gray-600 mb-1">Description</label>
            <textarea
              value={form.desc}
              onChange={onChange("desc")}
              placeholder="A short description or instructions for students"
              className="w-full min-h-[112px] rounded-xl border border-blue-100 focus:border-blue-300 focus:ring-2 focus:ring-blue-200 px-4 py-3 outline-none"
            />
          </div>

          {/* Batch & Year */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Batch *</label>
              <select
                value={form.batch}
                onChange={onChange("batch")}
                className="w-full rounded-xl border border-blue-100 focus:border-blue-300 focus:ring-2 focus:ring-blue-200 px-4 py-3 outline-none"
              >
                <option>2025 A/L</option>
                <option>2026 A/L</option>
               <option>2027 A/L</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Year</label>
              <input
                type="number"
                value={form.year}
                onChange={onChange("year")}
                className="w-full rounded-xl border border-blue-100 focus:border-blue-300 focus:ring-2 focus:ring-blue-200 px-4 py-3 outline-none"
              />
            </div>
          </div>

          {/* Footer actions */}
          <div className="mt-6 flex items-center justify-between">
            <button onClick={onClose} className="px-4 py-2 rounded-xl bg-white border">Cancel</button>
            <button
              onClick={save}
              className="px-5 py-2.5 rounded-xl bg-blue-600 text-white flex items-center gap-2 hover:bg-blue-700"
            >
              <Save size={18} /> Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

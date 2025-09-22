// src/components/MaterialsSection.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { PlusCircle, Trash2, Edit3, Link as LinkIcon, Filter, Save, X } from "lucide-react";
import { useRealtimeStore, writeStore } from "../utils/rtStore.js";
import { toast } from "react-hot-toast";
import {
  listMaterials,
  createMaterial,
  updateMaterial,
  removeMaterial,
} from "../api.js";

/* ------------ Portal helper ------------- */
function ModalPortal({ children }) {
  const [host, setHost] = useState(null);
  useEffect(() => {
    const div = document.createElement("div");
    div.setAttribute("id", "modal-host");
    document.body.appendChild(div);
    setHost(div);
    return () => {
      document.body.removeChild(div);
    };
  }, []);
  if (!host) return null;
  return createPortal(children, host);
}

/* ------------ Modal ------------- */
function MaterialModal({ open, onClose, initial }) {
  const defaults = {
    title: "",
    topic: "",
    type: "Note",
    week: 1,
    link: "",
    desc: "",
    batch: "2025 A/L",
    year: new Date().getFullYear(),
  };
  const [form, setForm] = useState(initial ?? defaults);

  useEffect(() => {
    setForm(initial ?? defaults);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initial?._id]);

  // Close on ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const save = async () => {
    if (!form.title?.trim()) return toast.error("⚠️ Title is required");

    const base = {
      title: form.title?.trim(),
      type: form.type || "Note",
      topic: form.topic?.trim() || "",
      subject: form.topic?.trim() || "",        // alias for some APIs
      week: Number(form.week) || 0,
      link: form.link?.trim() || "",
      desc: form.desc?.trim() || "",
      description: form.desc?.trim() || "",     // alias
      batch: form.batch || null,
      grade: form.batch || null,                // alias
      year: form.year != null && form.year !== "" ? Number(form.year) : null,
    };

    try {
      if (initial?._id) {
        const updated = await updateMaterial(initial._id, base);
        writeStore((s) => {
          s.materials = (s.materials || []).map((m) => (m._id === updated._id ? updated : m));
          return { ...s };
        });
        toast.success("✅ Material updated");
      } else {
        const payload = {
          ...base,
          createdAt: Date.now(),
          mid:
            (typeof crypto !== "undefined" && crypto.randomUUID)
              ? `mat_${crypto.randomUUID()}`
              : `mat_${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`,
        };
        console.log("[materials] POST payload →", payload);
        const created = await createMaterial(payload);
        writeStore((s) => {
          s.materials = [...(s.materials || []), created];
          return { ...s };
        });
        toast.success("🎉 Material added");
      }
      onClose?.();
    } catch (e) {
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        e?.message ||
        "Unknown error";
      console.error("Save failed:", e?.response?.status, e?.response?.data || e);
      toast.error(`Save failed${e?.response?.status ? " (" + e.response.status + ")" : ""}: ${msg}`);
    }
  };

  return (
    <ModalPortal>
      {/* overlay */}
      <div
        className="fixed inset-0 z-[10000] bg-black/40"
        onClick={onClose}
      />
      {/* dialog */}
      <div className="fixed inset-0 z-[10001] grid place-items-center">
        <div
          className="w-[95%] md:w-[900px] bg-white rounded-2xl shadow p-6"
          role="dialog"
          aria-modal="true"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">{initial ? "Edit Material" : "Add Learning Material"}</h3>
            <button onClick={onClose} className="text-blue-600 flex items-center gap-1" type="button">
              <X size={18} /> Close
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600">Title *</label>
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="input input-bordered w-full"
                placeholder="e.g., Database Normalization Notes"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Type *</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="input input-bordered w-full"
              >
                <option>Note</option>
                <option>Slide</option>
                <option>Reading</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-600">Topic</label>
              <input
                value={form.topic}
                onChange={(e) => setForm({ ...form, topic: e.target.value })}
                className="input input-bordered w-full"
                placeholder="e.g., SQL, Networking, OOP"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Week</label>
              <input
                type="number"
                value={form.week}
                onChange={(e) => setForm({ ...form, week: Number(e.target.value) })}
                className="input input-bordered w-full"
              />
            </div>

            <div className="md:grid-cols-2 md:col-span-2">
              <label className="text-sm text-gray-600">Link (optional)</label>
              <input
                value={form.link}
                onChange={(e) => setForm({ ...form, link: e.target.value })}
                className="input input-bordered w-full"
                placeholder="https://..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-sm text-gray-600">Description</label>
              <textarea
                value={form.desc}
                onChange={(e) => setForm({ ...form, desc: e.target.value })}
                className="input input-bordered w-full min-h-28"
                placeholder="A short description or instructions for students"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Batch *</label>
              <select
                value={form.batch}
                onChange={(e) => setForm({ ...form, batch: e.target.value })}
                className="input input-bordered w-full"
              >
                <option>2025 A/L</option>
                <option>2026 A/L</option>
                <option>2027 A/L</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-600">Year</label>
              <input
                type="number"
                value={form.year}
                onChange={(e) => setForm({ ...form, year: Number(e.target.value) })}
                className="input input-bordered w-full"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button onClick={onClose} className="px-4 py-2 rounded-lg bg-white border" type="button">
              Cancel
            </button>
            <button onClick={save} className="px-4 py-2 rounded-lg bg-blue-600 text-white flex items-center gap-2" type="button">
              <Save size={18} /> Save
            </button>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
}

/* ------------ Main ------------- */
export default function MaterialsSection() {
  const [store, update] = useRealtimeStore();
  const [q, setQ] = useState("");
  const [batch, setBatch] = useState("All Batches");
  const [type, setType] = useState("All");
  const [open, setOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);

  // fetch once (even in StrictMode)
  const didFetch = useRef(false);
  useEffect(() => {
    if (didFetch.current) return;
    didFetch.current = true;
    (async () => {
      try {
        const data = await listMaterials();
        update((s) => ({ ...s, materials: data || [] }));
      } catch (e) {
        console.error(e);
        toast.error("Failed to load materials");
      }
    })();
  }, [update]);

  const filtered = useMemo(() => {
    const list = Array.isArray(store.materials) ? store.materials : [];
    return list
      .filter((m) => m && typeof m === "object")
      .filter((m) => batch === "All Batches" || m.batch === batch)
      .filter((m) => type === "All" || m.type === type)
      .filter((m) => {
        const ql = q.toLowerCase();
        return (
          m.title?.toLowerCase().includes(ql) ||
          (m.topic || "").toLowerCase().includes(ql)
        );
      });
  }, [store, q, batch, type]);

  const del = async (id) => {
    try {
      await removeMaterial(id);
      update((s) => ({ ...s, materials: (s.materials || []).filter((m) => (m._id || m.id) !== id) }));
      toast.success("🗑️ Material deleted");
    } catch (e) {
      console.error(e);
      toast.error("❌ Delete failed");
    }
  };

  const duplicate = async (m) => {
    try {
      const copy = {
        title: `${m.title} (copy)`,
        topic: m.topic || "",
        type: m.type || "Note",
        week: Number(m.week) || 0,
        link: m.link || "",
        desc: m.desc || "",
        batch: m.batch || null,
        year: m.year != null ? Number(m.year) : null,
        createdAt: Date.now(),
        mid:
          (typeof crypto !== "undefined" && crypto.randomUUID)
            ? `mat_${crypto.randomUUID()}`
            : `mat_${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`,
      };
      const created = await createMaterial(copy);
      update((s) => ({ ...s, materials: [...(s.materials || []), created] }));
      toast.success("📄 Duplicated");
    } catch (e) {
      console.error(e);
      toast.error("❌ Duplicate failed");
    }
  };

  return (
    <div className="space-y-4">
      {/* header */}
      <div className="flex justify-between items-center">
        <div className="text-lg font-semibold">Learning Materials</div>
        <button
          onClick={() => {
            setEditItem(null);
            setOpen(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700"
          type="button" // prevent form-submit default
        >
          <PlusCircle size={18} /> Add Material
        </button>
      </div>

      {/* filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 px-3 py-2 bg-white border rounded-lg">
          <Filter size={16} />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search materials..."
            className="outline-none"
          />
        </div>
        <select
          value={batch}
          onChange={(e) => setBatch(e.target.value)}
          className="px-3 py-2 bg-white border rounded-lg"
        >
          <option>All Batches</option>
          <option>2025 A/L</option>
          <option>2026 A/L</option>
          <option>2027 A/L</option>
        </select>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="px-3 py-2 bg-white border rounded-lg"
        >
          <option>All</option>
          <option>Note</option>
          <option>Slide</option>
          <option>Reading</option>
        </select>
      </div>

      {/* list */}
      <div className="grid gap-4">
        {filtered.map((m) => {
          const id = m._id || m.id || m.mid;
          return (
            <div key={id} className="rounded-2xl bg-white shadow px-5 py-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 border text-blue-700">
                      {m.type}
                    </span>
                    {m.week ? <span className="text-xs text-gray-500">Week {m.week}</span> : null}
                    {m.batch && (
                      <span className="text-xs text-gray-500 px-2 py-0.5 rounded-full bg-gray-50 border">
                        {m.batch}
                      </span>
                    )}
                  </div>
                  <h4 className="text-lg font-semibold mt-1">{m.title}</h4>
                  {m.topic && <div className="text-sm text-gray-500">Topic: {m.topic}</div>}
                  {m.link && (
                    <a
                      className="inline-flex items-center gap-1 text-blue-600 mt-2"
                      href={m.link}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <LinkIcon size={16} /> Open resource
                    </a>
                  )}
                  {m.desc && <p className="text-sm text-gray-600 mt-2">{m.desc}</p>}
                  <div className="text-xs text-gray-400 mt-2">
                    Added {new Date(m.createdAt || Date.now()).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditItem(m);
                      setOpen(true);
                    }}
                    className="p-2 rounded border bg-white hover:bg-blue-50"
                    title="Edit"
                    type="button"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    onClick={() => del(id)}
                    className="p-2 rounded border bg-white hover:bg-red-50 text-red-600"
                    title="Delete"
                    type="button"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && <div className="text-sm text-gray-500">No materials found.</div>}
      </div>

      {/* modal */}
      <MaterialModal open={open} onClose={() => setOpen(false)} initial={editItem} />
    </div>
  );
}

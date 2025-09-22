// src/components/VideoSection.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { PlusCircle, Trash2, Copy, Play, Link as LinkIcon, Edit3, X, Filter } from "lucide-react";
import { useRealtimeStore, writeStore } from "../utils/rtStore.js";
import {
  listVideos,
  createVideo,
  updateVideo,
  removeVideo,
  toggleVideoPublish,
} from "../api.js";
import { toast } from "react-hot-toast";

/* ---------------- helpers ---------------- */
const rid = () => "v" + (crypto?.randomUUID?.() || Math.random().toString(36).slice(2));

function getYouTubeId(url = "") {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtube.com")) return u.searchParams.get("v");
    if (u.hostname.includes("youtu.be")) return u.pathname.slice(1);
  } catch {}
  return null;
}
function getYouTubeThumb(url) {
  const id = getYouTubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
}
function isValidUrl(str = "") {
  try { new URL(str); return true; } catch { return false; }
}

/* ---------------- video modal (create/edit) ---------------- */
function VideoModal({ open, onClose, initial }) {
  const [v, setV] = useState(initial ?? { title: "", url: "", batch: "Batch 1" });
  const thumb = getYouTubeThumb(v.url);

  // keep form in sync when editing item changes
  useEffect(() => {
    setV(initial ?? { title: "", url: "", batch: "Batch 1" });
  }, [initial]);

  if (!open) return null;

  const save = async () => {
    if (!v.title.trim()) return alert("Title is required.");
    if (!isValidUrl(v.url)) return alert("Enter a valid URL (YouTube preferred).");

    try {
      if (initial?._id) {
        // update on server
        const updated = await updateVideo(initial._id, {
          title: v.title, url: v.url, batch: v.batch,
        });
        // sync local store
        writeStore((s) => {
          s.videos = (s.videos || []).map((x) => (x._id === updated._id ? updated : x));
          return { ...s };
        });
      } else {
        // create on server
        const created = await createVideo({
          title: v.title, url: v.url, batch: v.batch, published: false,
        });
        writeStore((s) => {
          s.videos = [...(s.videos || []), created];
          return { ...s };
        });
      }
      toast.success("🎉 Video added successfully!");
      onClose?.();
    } catch (err) {
      console.error(err);
      alert("Save failed");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm grid place-items-center z-50">
      <div className="w-[96%] max-w-[900px] bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h3 className="text-lg font-semibold">{initial ? "Edit Video" : "Add Video"}</h3>
          <button onClick={onClose} className="text-blue-600 hover:underline">Close</button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 px-6 py-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Title *</label>
              <input
                value={v.title}
                onChange={(e) => setV({ ...v, title: e.target.value })}
                className="w-full rounded-xl border border-blue-100 focus:border-blue-300 focus:ring-2 focus:ring-blue-200 px-4 py-3 outline-none"
                placeholder="e.g., Intro to DBMS"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Video URL *</label>
              <input
                value={v.url}
                onChange={(e) => setV({ ...v, url: e.target.value.trim() })}
                className="w-full rounded-xl border border-blue-100 focus:border-blue-300 focus:ring-2 focus:ring-blue-200 px-4 py-3 outline-none"
                placeholder="https://youtu.be/..."
              />
              <p className="text-xs text-gray-500 mt-1">YouTube links show a preview automatically.</p>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Batch *</label>
              <select
                value={v.batch}
                onChange={(e) => setV({ ...v, batch: e.target.value })}
                className="w-full rounded-xl border border-blue-100 focus:border-blue-300 focus:ring-2 focus:ring-blue-200 px-4 py-3 outline-none"
              >
                <option>2025 A/L</option><option>2026 A/L</option><option>2027 A/L</option>
              </select>
            </div>
          </div>

          {/* live preview */}
          <div className="rounded-2xl border bg-gray-50/60 overflow-hidden">
            {thumb ? (
              <div className="relative">
                <img src={thumb} alt="Preview" className="w-full aspect-video object-cover" />
                <div className="absolute inset-0 grid place-items-center">
                  <div className="bg-black/40 rounded-full p-3">
                    <Play size={28} className="text-white" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full min-h-[220px] grid place-items-center text-sm text-gray-500 p-4">
                Paste a YouTube link to see a preview here.
              </div>
            )}
            <div className="p-3 text-xs text-gray-500 border-t">
              {isValidUrl(v.url) ? v.url : "No valid URL yet"}
            </div>
          </div>
        </div>

        <div className="px-6 pb-6 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-xl bg-white border">Cancel</button>
          <button onClick={save} className="px-5 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700">
            {initial ? "Update" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- player modal ---------------- */
function PlayerModal({ url, onClose }) {
  if (!url) return null;
  const ytId = getYouTubeId(url);
  const src = ytId
    ? `https://www.youtube.com/embed/${ytId}?rel=0&modestbranding=1`
    : url;

  return (
    <div className="fixed inset-0 bg-black/70 z-50 grid place-items-center p-4">
      <div className="w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden relative">
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white/90 hover:text-white flex items-center gap-1"
        >
          <X size={18} /> Close
        </button>
        <iframe
          className="w-full h-full"
          src={src}
          title="Video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}

/* ---------------- main section ---------------- */
export default function VideoSection() {
  const [store, update] = useRealtimeStore();
  const [q, setQ] = useState("");
  const [batch, setBatch] = useState("All Batches");
  const [sort, setSort] = useState("new");
  const [open, setOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [playing, setPlaying] = useState(null); // url for player

  // hydrate from backend — run once, even in StrictMode
  const didFetch = useRef(false);
  useEffect(() => {
    if (didFetch.current) return;
    didFetch.current = true;

    (async () => {
      try {
        const data = await listVideos();
        update((s) => ({ ...s, videos: data || [] }));
        toast.success("✅ Video updated!");

      } catch (e) {
        console.error(e);
        alert("Failed to load videos");
      }
    })();
  }, []); // <-- empty deps; do NOT include `update`

  const list = useMemo(() => {
    let arr = [...(store.videos || [])];
    // filter
    arr = arr
      .filter((x) => batch === "All Batches" || x.batch === batch)
      .filter((x) => (x.title || "").toLowerCase().includes(q.toLowerCase()));
    // sort
    if (sort === "new") arr.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    if (sort === "old") arr.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
    if (sort === "title") arr.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    return arr;
  }, [store, q, batch, sort]);

  // delete -> API then local
  const del = async (id) => {
    try {
      await removeVideo(id);
      update((s) => ({ ...s, videos: (s.videos || []).filter((x) => (x._id || x.id) !== id) }));
      toast.success("🗑️ Video deleted!");
    } catch (e) {
      console.error(e);
      alert("Delete failed");
    }
  };

  // duplicate -> API create then local
  const duplicate = async (item) => {
    try {
      const created = await createVideo({
        title: `${item.title} (copy)`,
        url: item.url,
        batch: item.batch,
        published: false,
      });
      update((s) => ({ ...s, videos: [...(s.videos || []), created] }));
    } catch (e) {
      console.error(e);
      alert("Duplicate failed");
    }
  };

  // publish toggle -> API then local
  const togglePublish = async (id) => {
    try {
      const updated = await toggleVideoPublish(id); // server toggles
      update((s) => ({
        ...s,
        videos: (s.videos || []).map((v) => ((v._id || v.id) === id ? updated : v)),
      }));
    } catch (e) {
      console.error(e);
      alert("Publish update failed");
    }
  };

  const copyLink = async (url) => {
    try {
      await navigator.clipboard.writeText(url);
      alert("Link copied to clipboard");
    } catch {
      alert(url);
    }
  };

  return (
    <div className="space-y-5">
      {/* header row */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="text-lg font-semibold">Video Portal</div>
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 px-3 py-2 bg-white border rounded-lg">
            <Filter size={16} />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search videos..."
              className="outline-none"
            />
          </div>
          <select
            value={batch}
            onChange={(e) => setBatch(e.target.value)}
            className="px-3 py-2 bg-white border rounded-lg"
          >
            <option>All Batches</option><option>2025 A/L</option><option>2026 A/L</option><option>2027 A/L</option>
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-3 py-2 bg-white border rounded-lg"
          >
            <option value="new">Newest</option>
            <option value="old">Oldest</option>
            <option value="title">Title A–Z</option>
          </select>

          <button
            onClick={() => { setEditItem(null); setOpen(true); }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg inline-flex items-center gap-2 hover:bg-blue-700"
          >
            <PlusCircle size={18} /> Add Video
          </button>
        </div>
      </div>

      {/* grid cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {list.map((v) => {
          const thumb = getYouTubeThumb(v.url);
          const published = !!v.published;
          const id = v._id || v.id; // support old local items too
          return (
            <div
              key={id}
              className="group rounded-2xl bg-white border border-blue-100 shadow-sm overflow-hidden hover:shadow-lg transition"
            >
              {/* media */}
              <div className="relative">
                {thumb ? (
                  <img src={thumb} alt={v.title} className="w-full aspect-video object-cover" />
                ) : (
                  <div className="w-full aspect-video grid place-items-center bg-gray-100 text-gray-500 text-sm">
                    No preview
                  </div>
                )}
                <button
                  onClick={() => setPlaying(v.url)}
                  className="absolute inset-0 hidden group-hover:grid place-items-center"
                  title="Play"
                >
                  <div className="bg-black/45 rounded-full p-4">
                    <Play className="text-white" />
                  </div>
                </button>
                <div className="absolute top-2 left-2 flex items-center gap-2">
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-600 text-white">{v.batch}</span>
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full ${
                      published ? "bg-green-600 text-white" : "bg-gray-300 text-gray-800"
                    }`}
                  >
                    {published ? "Published" : "Draft"}
                  </span>
                </div>
              </div>

              {/* body */}
              <div className="p-4 space-y-2">
                <h4 className="font-semibold line-clamp-1">{v.title}</h4>
                <div className="text-xs text-blue-700 inline-flex items-center gap-1 truncate">
                  <LinkIcon size={14} />{" "}
                  <a href={v.url} target="_blank" rel="noreferrer" className="truncate">
                    {v.url}
                  </a>
                </div>

                <div className="pt-3 flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => { setEditItem(v); setOpen(true); }}
                    className="px-3 py-1.5 rounded border bg-white hover:bg-blue-50 inline-flex items-center gap-1"
                  >
                    <Edit3 size={16} /> Edit
                  </button>
                  
                  <button
                    onClick={() => del(id)}
                    className="px-3 py-1.5 rounded border bg-white hover:bg-red-50 text-red-600 inline-flex items-center gap-1"
                  >
                    <Trash2 size={16} /> Delete
                  </button>

                  {/* publish toggle */}
                  <div className="ml-auto flex items-center gap-2">
                    <span className="text-xs text-gray-500">Publish</span>
                    <button
                      onClick={() => togglePublish(id)}
                      className={`w-12 h-6 rounded-full relative transition ${
                        published ? "bg-green-500" : "bg-gray-300"
                      }`}
                      title={published ? "Unpublish" : "Publish"}
                    >
                      <span
                        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${
                          published ? "right-0.5" : "left-0.5"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {list.length === 0 && (
          <div className="col-span-full">
            <div className="rounded-2xl border bg-white p-8 text-center text-sm text-gray-500">
              No videos yet. Click <b>Add Video</b> to create your first item.
            </div>
          </div>
        )}
      </div>

      {/* modals */}
      <VideoModal open={open} onClose={() => { setEditItem(null); setOpen(false); }} initial={editItem} />
      <PlayerModal url={playing} onClose={() => setPlaying(null)} />
    </div>
  );
}

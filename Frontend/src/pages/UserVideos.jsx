// src/pages/UserVideos.jsx
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

/**
 * Minimal user-side video grid
 * - Shows only published videos (admin toggles publish in backend)
 * - Optional batch filter (All Batches / 2025 A/L / 2026 A/L / 2027 A/L)
 * - Pagination with "Load more"
 * - Renders YouTube links as <iframe>, others as <video> with controls
 *
 * Tailwind: keep it minimal and clean
 */

const API_BASE =
  import.meta.env?.VITE_BACKEND_URL?.replace(/\/$/, "") || "http://localhost:4000";

// axios instance scoped to this file (per your request)
const api = axios.create({
  baseURL: `${API_BASE}/api/videos`,
  headers: { "Content-Type": "application/json", Accept: "application/json" },
  withCredentials: true,
});

// batches supported by your model
const BATCHES = ["All Batches", "2025 A/L", "2026 A/L", "2027 A/L"];

// --- tiny helpers ---
function isYouTube(url) {
  try {
    const u = new URL(url);
    return /(^|\.)youtube\.com$/.test(u.hostname) || u.hostname === "youtu.be";
  } catch {
    return false;
  }
}

function toYouTubeEmbed(url) {
  // supports both youtube.com/watch?v= and youtu.be/<id>
  try {
    const u = new URL(url);
    if (u.hostname === "youtu.be") {
      const id = u.pathname.slice(1);
      return `https://www.youtube.com/embed/${id}`;
    }
    if (/(^|\.)youtube\.com$/.test(u.hostname)) {
      const id = u.searchParams.get("v");
      if (id) return `https://www.youtube.com/embed/${id}`;
    }
  } catch {}
  return url; // fallback
}

export default function UserVideos() {
  const [videos, setVideos] = useState([]);
  const [batch, setBatch] = useState("All Batches");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const params = useMemo(() => {
    const p = {
      page,
      limit: 9,
      sort: "-createdAt",
      published: "true", // only published on user side
    };
    if (batch && batch !== "All Batches") p.batch = batch;
    if (q && q.trim()) p.q = q.trim();
    return p;
  }, [page, batch, q]);

  async function fetchVideos(append = false) {
    setLoading(true);
    setErr("");
    try {
      const { data } = await api.get("/", { params });
      if (!data?.ok) throw new Error("Unexpected response");
      setPages(data.meta?.pages || 1);
      setVideos((prev) => (append ? [...prev, ...data.data] : data.data));
    } catch (e) {
      setErr(e?.response?.data?.message || e.message || "Failed to load videos");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // reset to page 1 when filters change
    setPage(1);
  }, [batch, q]);

  useEffect(() => {
    fetchVideos(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, batch, q]);

  const canLoadMore = page < pages;

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-lg font-semibold tracking-tight">Videos</h1>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <label className="text-sm text-neutral-500">Batch</label>
            <select
              value={batch}
              onChange={(e) => setBatch(e.target.value)}
              className="h-9 rounded-md border border-neutral-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100"
            >
              {BATCHES.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          <div className="relative">
            <input
              placeholder="Search title or URL…"
              className="h-9 w-full rounded-md border border-neutral-200 bg-white px-3 pr-8 text-sm outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100 sm:w-64"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400">⌕</span>
          </div>
        </div>
      </div>

      {/* Error */}
      {err && (
        <div className="mb-4 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/60 dark:text-rose-300">
          {err}
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading && videos.length === 0
          ? Array.from({ length: 6 }).map((_, i) => (
              <div
                key={`sk-${i}`}
                className="animate-pulse rounded-lg border border-neutral-200 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-900"
              >
                <div className="mb-3 aspect-video rounded-md bg-neutral-200 dark:bg-neutral-800" />
                <div className="h-4 w-3/4 rounded bg-neutral-200 dark:bg-neutral-800" />
                <div className="mt-2 h-3 w-1/2 rounded bg-neutral-200 dark:bg-neutral-800" />
              </div>
            ))
          : videos.map((v) => (
              <article
                key={v._id}
                className="rounded-lg border border-neutral-200 bg-white p-3 shadow-sm transition hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900"
              >
                <div className="mb-3 overflow-hidden rounded-md">
                  {isYouTube(v.url) ? (
                    <iframe
                      className="aspect-video w-full"
                      src={toYouTubeEmbed(v.url)}
                      title={v.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  ) : (
                    <video
                      className="aspect-video w-full"
                      src={v.url}
                      controls
                      preload="metadata"
                    />
                  )}
                </div>

                <h2 className="line-clamp-2 text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  {v.title}
                </h2>

                <div className="mt-2 flex items-center justify-between">
                  <span className="rounded-full border border-neutral-200 px-2 py-0.5 text-[11px] text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
                    {v.batch || "—"}
                  </span>
                  <span className="text-[11px] text-neutral-400">
                    {new Date(v.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </article>
            ))}
      </div>

      {/* Empty state */}
      {!loading && videos.length === 0 && !err && (
        <div className="mt-10 rounded-md border border-neutral-200 bg-white px-4 py-10 text-center text-sm text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
          No published videos found.
        </div>
      )}

      {/* Load more */}
      <div className="mt-6 flex justify-center">
        {canLoadMore && (
          <button
            onClick={() => {
              setPage((p) => p + 1);
              // next fetch will append
              fetchVideos(true);
            }}
            disabled={loading}
            className="h-9 rounded-md border border-neutral-300 px-4 text-sm transition hover:bg-neutral-50 disabled:opacity-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
          >
            {loading ? "Loading…" : "Load more"}
          </button>
        )}
      </div>
    </div>
  );
}

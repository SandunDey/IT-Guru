// src/utils/rtStore.js
import { useEffect, useState } from "react";

const KEY = "itguru-teacher";

function seedIfEmpty() {
  const raw = localStorage.getItem(KEY);
  if (raw) return JSON.parse(raw);
  const seed = {
    brand: "ITGuru",
    materials: [
      { id: "m1", title: "Database Normalization Notes", topic: "DBMS", type: "Note", week: 3, link: "", desc: "Study notes for week 3", batch: "Batch 1", year: 2025, createdAt: Date.now() }
    ],
    quizzes: [
      { id: "q1", title: "Algebra Check", type: "Quiz", schedule: new Date().toISOString(), duration: 30, totalMarks: 9, batch: "Batch 2", published: false, desc: "" },
      { id: "q2", title: "testQuiz", type: "Quiz", schedule: new Date().toISOString(), duration: 30, totalMarks: 5, batch: "Batch 2", published: false, desc: "" },
    ],
    videos: [],
  };
  localStorage.setItem(KEY, JSON.stringify(seed));
  return seed;
}

export function readStore() {
  return JSON.parse(localStorage.getItem(KEY) || "null") || seedIfEmpty();
}

export function writeStore(updater) {
  const current = readStore();
  const next = typeof updater === "function" ? updater(current) : updater;
  localStorage.setItem(KEY, JSON.stringify(next));
  // notify other tabs/components
  const bc = new BroadcastChannel("itguru-teacher");
  bc.postMessage({ type: "refresh" });
  bc.close();
  return next;
}

export function useRealtimeStore() {
  const [store, setStore] = useState(() => seedIfEmpty());

  useEffect(() => {
    const bc = new BroadcastChannel("itguru-teacher");
    const onMsg = (e) => {
      if (e?.data?.type === "refresh") setStore(readStore());
    };
    bc.addEventListener("message", onMsg);

    const t = setInterval(() => setStore(readStore()), 8000); // light polling

    return () => {
      bc.removeEventListener("message", onMsg);
      bc.close();
      clearInterval(t);
    };
  }, []);

  // helper to update
  const update = (fn) => setStore(writeStore(fn));

  return [store, update];
}

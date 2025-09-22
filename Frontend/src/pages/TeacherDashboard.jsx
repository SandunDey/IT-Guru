// src/pages/TeacherDashboard.jsx
import React, { useMemo, useState } from "react";
import {
  BookOpen,
  ClipboardList,
  GraduationCap,
  Video as VideoIcon,
  FileText,
  LogOut,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import OverviewSection from "../components/OverviewSection.jsx";
import MaterialsSection from "../components/MaterialsSection.jsx";
import QuizSection from "../components/QuizSection.jsx";
import VideoSection from "../components/VideoSection.jsx";

// ✅ Export/Import + PDF
import ExportImportBar from "../components/ExportImportBar.jsx";
import generatePdfReport from "../utils/pdfReport.js";

import { useRealtimeStore } from "../utils/rtStore.js";
import logo from "../assets/logo.jpg";

/* -------------------------- Small UI helpers -------------------------- */
function NavBtn({ active, onClick, icon, children }) {
  return (
    <button
      onClick={onClick}
      className={`group relative overflow-hidden px-4 py-2 rounded-md text-left transition
        ${active ? "bg-blue-900 shadow-inner" : "hover:bg-blue-800"}`}
    >
      <span className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 bg-white/5" />
      <span className="inline-flex items-center gap-2">
        <span className="transition-transform group-hover:translate-x-0.5">{icon}</span>
        <span>{children}</span>
      </span>
    </button>
  );
}

function FancyButton({ className = "", children, ...props }) {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      whileHover={{ y: -1 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg shadow-sm
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300 ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}

/* -------------------------- Safe helpers -------------------------- */
const asList = (v) => (Array.isArray(v) ? v : []);
const clean = (arr) => asList(arr).filter((x) => x && typeof x === "object");
const safeDate = (v) => {
  try {
    const d = v ? new Date(v) : null;
    return d && !isNaN(d.getTime()) ? d.toISOString() : null;
  } catch {
    return null;
  }
};

/* ------------------------------ Page --------------------------------- */
export default function TeacherDashboard() {
  const [tab, setTab] = useState("overview");
  const [store] = useRealtimeStore();

  // Sanitize store arrays before using them anywhere
  const materials = clean(store?.materials);
  const quizzes = clean(store?.quizzes);
  const videos = clean(store?.videos);

  // Map store → report data (robust to nulls/missing fields)
  const reportData = useMemo(() => {
    return {
      overview: {
        teacherName: "Mr . Janaka Wikramage",
        courseCount: materials.length,
        studentCount: 162,
        lastSync: new Date().toISOString(),
      },
      materials: materials.map((m) => ({
        title: m?.title ?? "Untitled",
        subject: m?.topic ?? m?.type ?? "-",
        grade: m?.batch ?? m?.grade ?? m?.year ?? "-",
        views: Number(m?.views) || 0,
        createdAt: safeDate(m?.createdAt) || new Date().toISOString(),
      })),
      quizzes: quizzes.map((q) => ({
        title: q?.title ?? "Untitled quiz",
        questions: Number(q?.questions ?? q?.questionsCount ?? 0) || 0,
        avgScore: Number(q?.avgScore) || 0,
        attempts: Number(q?.attempts) || 0,
        createdAt: safeDate(q?.createdAt ?? q?.schedule) || new Date().toISOString(),
      })),
      videos: videos.map((v) => ({
        title: v?.title ?? "Untitled video",
        duration: v?.duration ?? "-",
        views: Number(v?.views) || 0,
        likes: Number(v?.likes) || 0,
        createdAt: safeDate(v?.createdAt) || new Date().toISOString(),
      })),
    };
  }, [materials, quizzes, videos]);

  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

  /* --------------------------- Render --------------------------------- */
  return (
    <div className="relative flex min-h-screen w-full bg-gradient-to-br from-blue-50 via-sky-50 to-blue-100">
      {!prefersReduced && (
        <div className="pointer-events-none fixed -z-10 inset-0 opacity-40">
          <motion.div
            className="absolute -top-32 -left-20 h-80 w-80 rounded-full bg-blue-300 blur-3xl"
            animate={{ x: [0, 20, -10, 0], y: [0, -10, 15, 0] }}
            transition={{ duration: 12, repeat: Infinity }}
          />
          <motion.div
            className="absolute -bottom-24 -right-20 h-72 w-72 rounded-full bg-sky-200 blur-3xl"
            animate={{ x: [0, -15, 10, 0], y: [0, 12, -8, 0] }}
            transition={{ duration: 14, repeat: Infinity, delay: 1 }}
          />
        </div>
      )}

      {/* Sidebar */}
      <aside className="w-64 bg-blue-700 text-white flex flex-col justify-between">
        <div>
          <div className="p-4 flex items-center gap-3">
            <img src={logo} alt="ITGuru Logo" className="h-10 w-10 rounded-lg object-cover border" />
            <div className="leading-tight">
              <div className="font-bold text-lg">Teacher Console</div>
              <div className="text-[11px] text-blue-100">ITGuru</div>
            </div>
          </div>

          <nav className="mt-4 flex flex-col space-y-2">
            <NavBtn active={tab === "overview"} onClick={() => setTab("overview")} icon={<GraduationCap size={18} />}>
              Overview
            </NavBtn>
            <NavBtn active={tab === "materials"} onClick={() => setTab("materials")} icon={<BookOpen size={18} />}>
              Learning Materials
            </NavBtn>
            <NavBtn active={tab === "quizzes"} onClick={() => setTab("quizzes")} icon={<ClipboardList size={18} />}>
              Quizzes &amp; Assessments
            </NavBtn>
            <NavBtn active={tab === "videos"} onClick={() => setTab("videos")} icon={<VideoIcon size={18} />}>
              Video Portal
            </NavBtn>
            <NavBtn active={tab === "export"} onClick={() => setTab("export")} icon={<FileText size={18} />}>
              Export / Import
            </NavBtn>
          </nav>
        </div>

        <div className="p-4">
          <FancyButton onClick={() => alert("Logout clicked")} className="w-full bg-red-500 hover:bg-red-600 text-white">
            <LogOut size={16} /> Logout
          </FancyButton>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-white/90 backdrop-blur shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={logo} alt="ITGuru Logo" className="h-10 w-10 rounded-lg object-cover border" />
              <div>
                <h1 className="text-2xl font-bold text-blue-700">ITGuru Teacher Dashboard</h1>
                <p className="text-xs text-gray-500">Manage materials, quizzes, and videos — in one place</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="max-w-7xl mx-auto px-4 py-6 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={prefersReduced ? { duration: 0 } : { duration: 0.24, ease: "easeOut" }}
            >
              {tab === "overview" && <OverviewSection />}

              {tab === "materials" && <MaterialsSection />}

              {tab === "quizzes" && <QuizSection />}

              {tab === "videos" && <VideoSection />}

              {tab === "export" && (
                <ExportImportBar
                  data={reportData}
                  onImport={(json) => console.log("Imported:", json)}
                  onPdf={(payload, filename) => generatePdfReport(payload, filename)}
                  defaultBatch="2025 A/L"
                />
              )}
            </motion.div>
          </AnimatePresence>

          <footer className="py-6 text-center text-xs text-gray-500">
            © {new Date().getFullYear()} ITGuru • Teacher Console
          </footer>
        </main>
      </div>
    </div>
  );
}

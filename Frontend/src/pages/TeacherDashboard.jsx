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
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

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
      className={`flex items-center gap-3 px-4 py-2 rounded-xl transition
        ${
          active
            ? "bg-white/10 text-white shadow-sm ring-1 ring-white/20"
            : "text-blue-100 hover:bg-white/5 hover:text-white"
        }`}
    >
      <span className="opacity-90">{icon}</span>
      <span className="font-medium">{children}</span>
    </button>
  );
}

function FancyButton({ className = "", children, ...props }) {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      whileHover={{ y: -1 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl shadow-sm
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

  const materials = clean(store?.materials);
  const quizzes = clean(store?.quizzes);
  const videos = clean(store?.videos);

  // Chart datasets from real quizzes
  const avgScoresByWeek = useMemo(() => {
    const grouped = {};
    quizzes.forEach((q) => {
      const d = q?.createdAt ? new Date(q.createdAt) : new Date();
      const week = `${d.getFullYear()}-W${Math.ceil(d.getDate() / 7)}`;
      if (!grouped[week]) grouped[week] = [];
      grouped[week].push(Number(q?.avgScore) || 0);
    });
    return Object.entries(grouped).map(([week, arr]) => ({
      week,
      avg: arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0,
    }));
  }, [quizzes]);

  const assessmentLoad = useMemo(() => {
    const grouped = {};
    quizzes.forEach((q) => {
      const d = q?.createdAt ? new Date(q.createdAt) : new Date();
      const month = d.toLocaleString("default", { month: "short" });
      grouped[month] = (grouped[month] || 0) + 1;
    });
    return Object.entries(grouped).map(([month, count]) => ({
      month,
      count,
    }));
  }, [quizzes]);

  const studentProgress = useMemo(() => {
    // Demo: using attempts to show progress %
    return quizzes.map((q, i) => ({
      name: q?.title ?? `Quiz ${i + 1}`,
      progress: Math.min(100, (q?.avgScore || 0) * 10),
    }));
  }, [quizzes]);

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
    <div className="relative flex min-h-screen w-full bg-gradient-to-b from-blue-50 via-white to-blue-50">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-blue-700 to-blue-800 text-white flex flex-col justify-between rounded-r-3xl shadow-md">
        <div>
          <div className="p-4 flex items-center gap-3">
            <img
              src={logo}
              alt="ITGuru Logo"
              className="h-10 w-10 rounded-lg object-cover border"
            />
            <div className="leading-tight">
              <div className="font-bold text-lg">Teacher Console</div>
              <div className="text-[11px] text-blue-100">ITGuru</div>
            </div>
          </div>

          <nav className="mt-4 flex flex-col space-y-2">
            <NavBtn
              active={tab === "overview"}
              onClick={() => setTab("overview")}
              icon={<GraduationCap size={18} />}
            >
              Overview
            </NavBtn>
            <NavBtn
              active={tab === "materials"}
              onClick={() => setTab("materials")}
              icon={<BookOpen size={18} />}
            >
              Learning Materials
            </NavBtn>
            <NavBtn
              active={tab === "quizzes"}
              onClick={() => setTab("quizzes")}
              icon={<ClipboardList size={18} />}
            >
              Quizzes &amp; Assessments
            </NavBtn>
            <NavBtn
              active={tab === "videos"}
              onClick={() => setTab("videos")}
              icon={<VideoIcon size={18} />}
            >
              Video Portal
            </NavBtn>
            <NavBtn
              active={tab === "export"}
              onClick={() => setTab("export")}
              icon={<FileText size={18} />}
            >
              Export / Import
            </NavBtn>
          </nav>
        </div>

        <div className="p-4">
          <FancyButton
            onClick={() => alert("Logout clicked")}
            className="w-full bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-sm"
          >
            <LogOut size={16} /> Logout
          </FancyButton>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-white/85 backdrop-blur border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={logo}
                alt="ITGuru Logo"
                className="h-10 w-10 rounded-lg object-cover border"
              />
              <div>
                <h1 className="text-2xl font-bold text-blue-700">
                  ITGuru Teacher Dashboard
                </h1>
                <p className="text-xs text-gray-500">
                  Manage materials, quizzes, and videos — in one place
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="max-w-7xl mx-auto px-4 py-6 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={
                prefersReduced
                  ? { duration: 0 }
                  : { duration: 0.2, ease: "easeOut" }
              }
            >
              {tab === "overview" && (
                <div className="space-y-8">
                  <OverviewSection />

                  {/* 📊 Charts */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Average Scores by Week */}
                    <div className="bg-white rounded-xl shadow p-4">
                      <h2 className="text-lg font-semibold text-blue-700 mb-3">
                        Average Scores by Week
                      </h2>
                      <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={avgScoresByWeek}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                          <XAxis dataKey="week" stroke="#2563eb" />
                          <YAxis stroke="#2563eb" />
                          <Tooltip />
                          <Line
                            type="monotone"
                            dataKey="avg"
                            stroke="#2563eb"
                            strokeWidth={2}
                            dot={{ r: 4, fill: "#2563eb" }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Assessment Load */}
                    <div className="bg-white rounded-xl shadow p-4">
                      <h2 className="text-lg font-semibold text-blue-700 mb-3">
                        Assessment Load (Monthly)
                      </h2>
                      <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={assessmentLoad}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                          <XAxis dataKey="month" stroke="#2563eb" />
                          <YAxis stroke="#2563eb" />
                          <Tooltip />
                          <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Student Progress */}
                  <div className="bg-white rounded-xl shadow p-4">
                    <h2 className="text-lg font-semibold text-blue-700 mb-3">
                      Student Progress
                    </h2>
                    <ResponsiveContainer width="100%" height={280}>
                      <BarChart data={studentProgress}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                        <XAxis dataKey="name" stroke="#2563eb" />
                        <YAxis stroke="#2563eb" />
                        <Tooltip />
                        <Bar dataKey="progress" fill="#1d4ed8" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
              {tab === "materials" && <MaterialsSection />}
              {tab === "quizzes" && <QuizSection />}
              {tab === "videos" && <VideoSection />}
              {tab === "export" && (
                <ExportImportBar
                  data={reportData}
                  onImport={(json) => console.log("Imported:", json)}
                  onPdf={(payload, filename) =>
                    generatePdfReport(payload, filename)
                  }
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

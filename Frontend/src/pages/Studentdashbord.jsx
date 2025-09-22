// src/pages/Studentdashbord.jsx
import React, { useMemo, useState, useEffect } from "react";
import {
  Bell,
  LogOut,
  Menu,
  Search,
  X,
  Home,
  BookOpen,
  ClipboardList,
  Megaphone,
  MessagesSquare,
  CreditCard,
  Settings,
  HelpCircle,
  Calendar as CalendarIcon,
  TrendingUp,
  Activity,
  PieChart,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Pie,
  PieChart as RPPieChart,
  Cell,
} from "recharts";
import { motion } from "framer-motion"; // ✨ animations (UI only)
import { useNavigate } from "react-router-dom";
import Logo from "../assets/logo.jpg";
import { loadAuth } from "../api"; // single source of truth for user+token
import Footer from "../components/footer";
// ---------- MOCK DASH METRICS (keep these until real data) ----------
const stats = [
  { label: "Enrolled Courses", value: 5 },
  { label: "Completed Assignments", value: 12 },
  { label: "Pending Payments", value: 2 },
  { label: "GPA", value: 3.8 },
];

const courseProgress = [
  { title: "Intro to Psychology", progress: 75 },
  { title: "Data Structures", progress: 52 },
  { title: "Web Development", progress: 61 },
  { title: "Math for CS", progress: 44 },
];

const announcements = [
  { title: "New course materials uploaded", body: "Check Week 5 folder for notes & quiz.", time: "2h ago" },
  { title: "Midterm schedule posted", body: "See Exams tab for dates and venues.", time: "Yesterday" },
];

const activitySeries = [
  { day: "Mon", minutes: 35 },
  { day: "Tue", minutes: 42 },
  { day: "Wed", minutes: 50 },
  { day: "Thu", minutes: 28 },
  { day: "Fri", minutes: 60 },
  { day: "Sat", minutes: 25 },
  { day: "Sun", minutes: 15 },
];

const gradeBuckets = [
  { name: "A", value: 6 },
  { name: "B", value: 8 },
  { name: "C", value: 3 },
  { name: "D/F", value: 1 },
];

const assignmentVelocity = [
  { week: "W1", completed: 6 },
  { week: "W2", completed: 4 },
  { week: "W3", completed: 8 },
  { week: "W4", completed: 5 },
  { week: "W5", completed: 9 },
];

const COLORS = ["#2563eb", "#3b82f6", "#60a5fa", "#93c5fd"]; // Tailwind blues

// Small animation presets
const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};
const pop = { whileHover: { y: -2 }, whileTap: { y: 0 } };

// ---------- COMPONENT ----------
export default function StudentDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  // Single source of truth: app_auth.user
  const [user, setUser] = useState(() => loadAuth().user || null);

  // Guard: only allow students with a token
  useEffect(() => {
    const { token, user } = loadAuth();
    const role = (user?.role || "").toLowerCase();
    if (!token || role !== "student") {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  // react to profile/auth updates (this tab + other tabs)
  useEffect(() => {
    const syncFromStorage = () => {
      const { user } = loadAuth();
      setUser(user || null);
    };

    const onStorage = (e) => {
      if (e.key === "app_auth") syncFromStorage();
    };

    window.addEventListener("auth:updated", syncFromStorage);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("auth:updated", syncFromStorage);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("app_auth");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    navigate("/", { replace: true });
  };

  const displayName = user?.name || user?.fullName || user?.email || "Student";
  const studentId = user?.studentId || user?._id || user?.id;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Topbar */}
      <header className="sticky top-0 z-40 w-full border-b border-blue-100 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/50">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button className="rounded-xl p-2 text-blue-700/80 hover:bg-blue-50 md:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2">
              <img src={Logo} alt="IT Guru Logo" className="h-10 w-10 rounded-full object-cover shadow-md ring-2 ring-blue-100" />
              <span className="text-lg font-semibold text-blue-900">ITGuru</span>
            </div>
          </div>

          <div className="hidden w-80 items-center gap-2 rounded-2xl border border-blue-100 bg-white px-3 py-2 text-blue-900 shadow-sm md:flex">
            <Search className="h-4 w-4 text-blue-400" />
            <input className="w-full bg-transparent text-sm outline-none placeholder-blue-300" placeholder="Search courses, assignments…" />
          </div>

          <div className="flex items-center gap-3">
            <button className="rounded-xl p-2 text-blue-700/80 transition hover:bg-blue-50">
              <Bell className="h-5 w-5" />
            </button>

            <div
              className="cursor-pointer items-center gap-3 rounded-full bg-blue-50/80 px-3 py-1 backdrop-blur-sm transition hover:bg-blue-100 hidden sm:flex"
              onClick={() =>
                navigate("/student/profile", {
                  state: { studentId },
                })
              }
            >
              <img
                src={`https://i.pravatar.cc/40?u=${encodeURIComponent(displayName)}`}
                alt="avatar"
                className="h-8 w-8 rounded-full ring-2 ring-white shadow"
              />
              <span className="text-sm font-medium text-blue-900">{displayName}</span>
            </div>

            <button className="rounded-xl p-2 text-blue-700/80 transition hover:bg-blue-50" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-6 sm:px-6 lg:px-8 md:grid-cols-[240px_1fr]">
        {/* Sidebar */}
        <aside className={`fixed inset-0 z-50 md:static ${sidebarOpen ? "block" : "hidden md:block"}`}>
          {/* overlay on mobile */}
          {sidebarOpen && <div className="absolute inset-0 bg-black/30" onClick={() => setSidebarOpen(false)} />}
          <motion.div
            initial={{ x: -16, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.35 }}
            className="relative h-full w-72 overflow-hidden rounded-r-2xl md:w-auto md:rounded-2xl"
          >
            <nav className="h-full rounded-2xl bg-gradient-to-b from-blue-700 to-blue-800 p-4 text-blue-50 shadow-2xl md:sticky md:top-20 md:h-[calc(100vh-6rem)]">
              <div className="mb-2 flex items-center justify-between md:hidden">
                <span className="text-base font-semibold">Menu</span>
                <button onClick={() => setSidebarOpen(false)} className="rounded-lg p-2 hover:bg-white/10">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <SidebarLink icon={<Home className="h-5 w-5" />} label="Dashboard" onClick={() => navigate("/StudentDashboard")} />
              <SidebarLink icon={<BookOpen className="h-5 w-5" />} label="Class" onClick={() => navigate("/Uservideos")} />
              <SidebarLink icon={<ClipboardList className="h-5 w-5" />} label="Assignments" />
              <SidebarLink icon={<Megaphone className="h-5 w-5" />} label="Announcements" />
              <SidebarLink icon={<MessagesSquare className="h-5 w-5" />} label="Messages" />
              <SidebarLink icon={<CreditCard className="h-5 w-5" />} label="Payments" />
              <SidebarLink icon={<Settings className="h-5 w-5" />} label="Settings" />
              <SidebarLink icon={<HelpCircle className="h-5 w-5" />} label="Help" />
            </nav>
          </motion.div>
        </aside>

        {/* Main */}
        <main className="space-y-6">
          {/* Welcome + basic identity from login */}
          <motion.section variants={fadeUp} initial="hidden" animate="show" className="rounded-2xl bg-gradient-to-r from-blue-50 to-white p-6 shadow-sm ring-1 ring-blue-100/60">
            <h1 className="text-2xl font-semibold text-blue-900">Welcome back, {displayName}! 🎓</h1>
            <p className="mt-1 text-blue-800/80">
              {studentId ? (
                <>Student ID: <span className="font-semibold">{studentId}</span></>
              ) : (
                <>You have completed <span className="font-semibold">3</span> out of <span className="font-semibold">5</span> courses.</>
              )}
            </p>
          </motion.section>

          {/* Quick Stats */}
          <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((s) => (
              <motion.div
                key={s.label}
                {...pop}
                className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm transition hover:shadow-md hover:ring-1 hover:ring-blue-200"
              >
                <p className="text-sm text-blue-700/80">{s.label}</p>
                <p className="mt-2 text-2xl font-semibold text-blue-900">{s.value}</p>
              </motion.div>
            ))}
          </section>

          {/* Content Grid */}
          <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Courses */}
            <div className="space-y-4 lg:col-span-2">
              <Card title="Enrolled Courses">
                <div className="space-y-3">
                  {courseProgress.map((c) => (
                    <motion.div key={c.title} {...pop} className="rounded-xl border border-blue-100/70 bg-white p-3 shadow-sm">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-blue-900">{c.title}</p>
                        <span className="text-sm text-blue-700/80">{c.progress}%</span>
                      </div>
                      <div className="mt-2 h-2 w-full rounded-full bg-blue-100">
                        <div className="h-2 rounded-full bg-blue-600" style={{ width: `${c.progress}%` }} />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>

              <Card title="Recent Announcements">
                <ul className="space-y-3">
                  {announcements.map((a, i) => (
                    <motion.li key={i} {...pop} className="rounded-xl border border-blue-100/70 bg-white p-3 shadow-sm">
                      <p className="font-medium text-blue-900">{a.title}</p>
                      <p className="text-sm text-blue-800/80">{a.body}</p>
                      <p className="mt-1 text-xs text-blue-600/70">{a.time}</p>
                    </motion.li>
                  ))}
                </ul>
              </Card>
            </div>

            {/* Right rail: Calendar + Insights */}
            <div className="space-y-4">
              <Card title="April 2024" icon={<CalendarIcon className="h-4 w-4 text-blue-700" />}>
                <MiniCalendar />
              </Card>

              {/* INSIGHTS */}
              <Card title="Study Insights" icon={<TrendingUp className="h-4 w-4 text-blue-700" />}>
                <div className="space-y-6">
                  {/* Activity trend */}
                  <WidgetTitle icon={<Activity className="h-4 w-4 text-blue-600" />} text="Weekly Study Minutes" />
                  <div className="h-32">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={activitySeries} margin={{ left: 0, right: 0, top: 10, bottom: 0 }}>
                        <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#1e3a8a" }} />
                        <YAxis hide />
                        <Tooltip cursor={{ opacity: 0.2 }} />
                        <Area dataKey="minutes" type="monotone" stroke="#60a5fa" fill="#bfdbfe" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Assignment velocity */}
                  <WidgetTitle icon={<ClipboardList className="h-4 w-4 text-blue-600" />} text="Assignments Completed per Week" />
                  <div className="h-36">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={assignmentVelocity}>
                        <XAxis dataKey="week" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#1e3a8a" }} />
                        <YAxis hide />
                        <Tooltip cursor={{ opacity: 0.2 }} />
                        <Bar dataKey="completed" radius={[8, 8, 8, 8]} fill="#3b82f6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Grade distribution */}
                  <WidgetTitle icon={<PieChart className="h-4 w-4 text-blue-600" />} text="Grade Distribution" />
                  <div className="h-40">
                    <ResponsiveContainer width="100%" height="100%">
                      <RPPieChart>
                        <Pie data={gradeBuckets} innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                          {gradeBuckets.map((_, idx) => (
                            <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </RPPieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </Card>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

// ---------- REUSABLES ----------
function SidebarLink({ icon, label, active = false, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group w-full text-left flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition ${
        active ? "bg-white/15 text:white" : "text-blue-50/90 hover:bg-white/10 hover:text-white"
      }`}
    >
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-white/10 text-white/90 ring-1 ring-white/10">{icon}</span>
      <span>{label}</span>
      <span className="ml-auto hidden text-xs opacity-0 transition group-hover:opacity-100 md:block">›</span>
    </button>
  );
}

function Card({ title, children, icon }) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="show"
      className="rounded-2xl border border-blue-100 bg:white p-4 shadow-sm transition hover:shadow-md"
    >
      <div className="mb-3 flex items-center gap-2">
        {icon}
        <h3 className="text-base font-semibold text-blue-900">{title}</h3>
      </div>
      {children}
    </motion.div>
  );
}

function WidgetTitle({ icon, text }) {
  return (
    <div className="mb-2 flex items-center gap-2 text-sm font-medium text-blue-900">
      {icon}
      <span>{text}</span>
    </div>
  );
}

function MiniCalendar() {
  const days = useMemo(() => ["S", "M", "T", "W", "T", "F", "S"], []);
  const dates = useMemo(() => Array.from({ length: 30 }, (_, i) => i + 1), []);
  const selected = 20;

  return (
    <div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs text-blue-700/80">
        {days.map((d) => (
          <div key={d} className="py-1">
            {d}
          </div>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-1">
        {Array.from({ length: 1 }).map((_, i) => (
          <div key={i} />
        ))}
        {dates.map((d) => (
          <button
            key={d}
            className={`aspect-square rounded-xl text-sm transition ${
              d === selected ? "bg-blue-600 text-white shadow" : "text-blue-900 hover:bg-blue-50"
            }`}
          >
            {d}
          </button>
        ))}
      </div>
    </div>
    
  );
}

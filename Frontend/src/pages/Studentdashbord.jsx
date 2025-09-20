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
import { useLocation, useNavigate } from "react-router-dom";
import Logo from "../assets/logo.jpg";

// ---------- MOCK DASH METRICS (keep these until you plug real data) ----------
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

const COLORS = ["#3b82f6", "#60a5fa", "#93c5fd", "#bfdbfe"]; // Tailwind blues

// ---------- COMPONENT ----------
export default function StudentDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Prefer the user passed via navigation; otherwise fall back to stored session
  const storedUser =
    (sessionStorage.getItem("user") && JSON.parse(sessionStorage.getItem("user"))) ||
    (localStorage.getItem("user") && JSON.parse(localStorage.getItem("user"))) ||
    null;

  const user = location.state?.user || storedUser;

  // Guard: only allow students with a token
  useEffect(() => {
    const token = sessionStorage.getItem("token") || localStorage.getItem("token");
    const role = (user?.role || "").toLowerCase();

    if (!token || role !== "student") {
      // bounce to login if missing or wrong role
      navigate("/admin", { replace: true });
    }
  }, [navigate, user]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    navigate("/", { replace: true });
  };

  const displayName = user?.name || user?.fullName || user?.email || "Student";
  const studentId = user?._id || user?.id || user?.studentId;

  return (
    <div className="min-h-screen w-full bg-slate-50">
      {/* Topbar */}
      <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="md:hidden rounded-xl p-2 hover:bg-slate-100" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2">
              <img src={Logo} alt="IT Guru Logo" className="h-16 w-16 rounded-full object-cover shadow-lg" />
              <span className="text-lg font-semibold">ITGuru</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2 rounded-2xl border bg-white px-3 py-2 shadow-sm w-80">
            <Search className="h-4 w-4 text-slate-400" />
            <input className="w-full bg-transparent text-sm outline-none" placeholder="Search courses, assignments…" />
          </div>

          <div className="flex items-center gap-3">
            <button className="rounded-xl p-2 hover:bg-slate-100">
              <Bell className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3 rounded-full bg-slate-100 px-3 py-1">
              <img src={`https://i.pravatar.cc/40?u=${encodeURIComponent(displayName)}`} alt="avatar" className="h-8 w-8 rounded-full" />
              <span className="hidden sm:block text-sm font-medium">{displayName}</span>
            </div>

            <button className="rounded-xl p-2 hover:bg-slate-100" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6 py-6">
        {/* Sidebar */}
        <aside className={`fixed inset-0 z-50 bg-black/30 md:static md:bg-transparent ${sidebarOpen ? "block" : "hidden md:block"}`}>
          <div className={`h-full w-72 md:w-auto md:h-auto md:block bg-white md:bg-transparent shadow-xl md:shadow-none ${sidebarOpen ? "animate-in fade-in zoom-in" : ""}`}>
            <nav className="md:sticky md:top-20 md:h[calc(100vh-6rem)] rounded-2xl bg-white p-4 shadow-sm md:shadow md:block">
              <div className="mb-2 flex items-center justify-between md:hidden">
                <span className="text-base font-semibold">Menu</span>
                <button onClick={() => setSidebarOpen(false)} className="rounded-lg p-2 hover:bg-slate-100">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <SidebarLink icon={<Home className="h-5 w-5" />} label="Dashboard" active />
              <SidebarLink icon={<BookOpen className="h-5 w-5" />} label="Courses" />
              <SidebarLink icon={<ClipboardList className="h-5 w-5" />} label="Assignments" />
              <SidebarLink icon={<Megaphone className="h-5 w-5" />} label="Announcements" />
              <SidebarLink icon={<MessagesSquare className="h-5 w-5" />} label="Messages" />
              <SidebarLink icon={<CreditCard className="h-5 w-5" />} label="Payments" />
              <SidebarLink icon={<Settings className="h-5 w-5" />} label="Settings" />
              <SidebarLink icon={<HelpCircle className="h-5 w-5" />} label="Help" />
            </nav>
          </div>
        </aside>

        {/* Main */}
        <main className="space-y-6">
          {/* Welcome + basic identity from login */}
          <section className="rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 p-6 shadow-sm">
            <h1 className="text-2xl font-semibold">Welcome back, {displayName}! 🎓</h1>
            <p className="mt-1 text-slate-600">
              {studentId ? (
                <>
                  Student ID: <span className="font-semibold">{studentId}</span>
                </>
              ) : (
                <>You have completed <span className="font-semibold">3</span> out of <span className="font-semibold">5</span> courses.</>
              )}
            </p>
          </section>

          {/* Quick Stats */}
          <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="rounded-2xl border bg-white p-4 shadow-sm">
                <p className="text-sm text-slate-500">{s.label}</p>
                <p className="mt-2 text-2xl font-semibold">{s.value}</p>
              </div>
            ))}
          </section>

          {/* Content Grid */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Courses */}
            <div className="lg:col-span-2 space-y-4">
              <Card title="Enrolled Courses">
                <div className="space-y-3">
                  {courseProgress.map((c) => (
                    <div key={c.title} className="rounded-xl border p-3">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{c.title}</p>
                        <span className="text-sm text-slate-600">{c.progress}%</span>
                      </div>
                      <div className="mt-2 h-2 w-full rounded-full bg-slate-200">
                        <div className="h-2 rounded-full bg-blue-500" style={{ width: `${c.progress}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card title="Recent Announcements">
                <ul className="space-y-3">
                  {announcements.map((a, i) => (
                    <li key={i} className="rounded-xl border p-3">
                      <p className="font-medium">{a.title}</p>
                      <p className="text-sm text-slate-600">{a.body}</p>
                      <p className="mt-1 text-xs text-slate-500">{a.time}</p>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>

            {/* Right rail: Calendar + Insights */}
            <div className="space-y-4">
              <Card title="April 2024" icon={<CalendarIcon className="h-4 w-4" />}>
                <MiniCalendar />
              </Card>

              {/* INSIGHTS */}
              <Card title="Study Insights" icon={<TrendingUp className="h-4 w-4" />}>
                <div className="space-y-6">
                  {/* Activity trend */}
                  <WidgetTitle icon={<Activity className="h-4 w-4" />} text="Weekly Study Minutes" />
                  <div className="h-32">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={activitySeries} margin={{ left: 0, right: 0, top: 10, bottom: 0 }}>
                        <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                        <YAxis hide />
                        <Tooltip cursor={{ opacity: 0.2 }} />
                        <Area dataKey="minutes" type="monotone" stroke="#60a5fa" fill="#bfdbfe" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Assignment velocity */}
                  <WidgetTitle icon={<ClipboardList className="h-4 w-4" />} text="Assignments Completed per Week" />
                  <div className="h-36">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={assignmentVelocity}>
                        <XAxis dataKey="week" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                        <YAxis hide />
                        <Tooltip cursor={{ opacity: 0.2 }} />
                        <Bar dataKey="completed" radius={[8, 8, 8, 8]} fill="#3b82f6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Grade distribution */}
                  <WidgetTitle icon={<PieChart className="h-4 w-4" />} text="Grade Distribution" />
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
function SidebarLink({ icon, label, active }) {
  return (
    <a
      href="#"
      className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium hover:bg-slate-100 ${
        active ? "bg-slate-100 text-slate-900" : "text-slate-700"
      }`}
    >
      {icon}
      <span>{label}</span>
    </a>
  );
}

function Card({ title, children, icon }) {
  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        {icon}
        <h3 className="text-base font-semibold">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function WidgetTitle({ icon, text }) {
  return (
    <div className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
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
      <div className="grid grid-cols-7 gap-1 text-center text-xs text-slate-500">
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
            className={`aspect-square rounded-xl text-sm ${d === selected ? "bg-blue-600 text-white" : "hover:bg-slate-100"}`}
          >
            {d}
          </button>
        ))}
      </div>
    </div>
  );
}

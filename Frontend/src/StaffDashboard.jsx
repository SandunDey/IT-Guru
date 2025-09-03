import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Users,
  UserPlus,
  GraduationCap,
  Shield,
  Search,
  Loader2,
  Filter,
  LogOut,
  LayoutDashboard,
  BookOpen,
  Coins,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Resolve API base from Vite or CRA envs (works in both)
const API_BASE =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_BASE_URL) ||
  (typeof process !== "undefined" && process.env?.REACT_APP_API_BASE_URL) ||
  "";

const DEMO_MODE = !API_BASE; // If you haven't set API base yet, we'll show demo data

export default function StaffDashboard() {
  const navigate = useNavigate();

  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [q, setQ] = useState("");
  const [role, setRole] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  useEffect(() => {
    let ignore = false;
    async function fetchStaff() {
      setLoading(true);
      setError("");
      try {
        if (DEMO_MODE) {
          // Demo data (only used if API_BASE not configured)
          await new Promise((r) => setTimeout(r, 600));
          const demo = [
            { _id: "1", staffId: "STF-001", name: "Anushka Perera", email: "anu@itguru.lk", role: "admin", gender: "Male", phonenumber: "+94711234567" },
            { _id: "2", staffId: "STF-002", name: "Nimali Jayasena", email: "nimali@itguru.lk", role: "teacher", gender: "Female", phonenumber: "+94712345678" },
            { _id: "3", staffId: "STF-003", name: "Kasun Silva", email: "kasun@itguru.lk", role: "staff", gender: "Male", phonenumber: "+94719876543" },
            { _id: "4", staffId: "STF-004", name: "Tharushi Fernando", email: "tharu@itguru.lk", role: "teacher", gender: "Female", phonenumber: "+94714561234" },
          ];
          if (!ignore) setStaff(demo);
        } else {
          const res = await axios.get(`${API_BASE}/api/staff`, { withCredentials: true });
          if (!ignore) setStaff(res.data || []);
        }
      } catch (err) {
        const msg = err?.response?.data?.message || err?.message || "Failed to load staff";
        if (!ignore) setError(msg);
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    fetchStaff();
    return () => { ignore = true; };
  }, []);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const list = staff.filter((s) => {
      const matchesQ = !needle ||
        s.name?.toLowerCase().includes(needle) ||
        s.email?.toLowerCase().includes(needle) ||
        s.staffId?.toLowerCase().includes(needle);
      const matchesRole = role === "all" || s.role === role;
      return matchesQ && matchesRole;
    });

    const sorted = [...list].sort((a, b) => {
      if (sortBy === "name") return (a.name || "").localeCompare(b.name || "");
      if (sortBy === "role") return (a.role || "").localeCompare(b.role || "");
      return (a.staffId || "").localeCompare(b.staffId || "");
    });
    return sorted;
  }, [staff, q, role, sortBy]);

  const total = staff.length;
  const admins = staff.filter((s) => s.role === "admin").length;
  const teachers = staff.filter((s) => s.role === "teacher").length;
  const support = staff.filter((s) => s.role === "staff").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-indigo-50 to-white">
      {/* Top bar */}
      <header className="sticky top-0 z-40 backdrop-blur bg-white/70 border-b border-indigo-100/70">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 shadow-inner" />
            <div>
              <div className="text-xl font-bold tracking-tight text-slate-900">ITGURU</div>
              <div className="text-[11px] -mt-0.5 text-slate-500">E‑Tuition Platform • Staff Dashboard</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/admin/staff/new")}
              className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-3.5 py-2 text-white shadow hover:bg-amber-600 active:translate-y-px"
            >
              <UserPlus size={18} /> <span>Add Staff</span>
            </button>
            <button className="hidden md:inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-slate-700 hover:bg-slate-50">
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sidebar */}
        <aside className="lg:col-span-3">
          <nav className="rounded-2xl bg-white/70 backdrop-blur border border-slate-200/60 shadow-sm p-3">
            <NavItem icon={<LayoutDashboard size={18} />} label="Overview" active />
            <NavItem icon={<Users size={18} />} label="Staff" />
            <NavItem icon={<GraduationCap size={18} />} label="Teachers" />
            <NavItem icon={<BookOpen size={18} />} label="Courses" />
            <NavItem icon={<Coins size={18} />} label="Payments" />
            <div className="mt-4 border-t border-slate-100 pt-4 text-[11px] text-slate-400">
              v1.0 • Brand theme: <span className="text-indigo-500 font-medium">Sky ↗ Indigo</span>
            </div>
          </nav>
        </aside>

        {/* Main */}
        <main className="lg:col-span-9 space-y-6">
          {/* KPI cards */}
          <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <KpiCard
              icon={<Users className="text-sky-600" size={20} />}
              label="Total Staff"
              value={loading ? "…" : total}
              sub={loading ? "Loading" : "All active members"}
            />
            <KpiCard
              icon={<Shield className="text-indigo-600" size={20} />}
              label="Admins"
              value={loading ? "…" : admins}
              sub="Manage platform access"
            />
            <KpiCard
              icon={<GraduationCap className="text-purple-600" size={20} />}
              label="Teachers"
              value={loading ? "…" : teachers}
              sub="Active instructors"
            />
            <KpiCard
              icon={<Users className="text-emerald-600" size={20} />}
              label="Support"
              value={loading ? "…" : support}
              sub="Ops & staff"
            />
          </section>

          {/* Toolbar */}
          <section className="rounded-2xl bg-white/80 backdrop-blur border border-slate-200/60 shadow-sm p-3 md:p-4">
            <div className="flex flex-col md:flex-row md:items-center gap-3">
              <div className="relative flex-1">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                  placeholder="Search by name, email or Staff ID"
                />
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2 py-1.5">
                  <Filter size={16} className="text-slate-500" />
                  <select
                    className="bg-transparent outline-none text-sm"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="all">All roles</option>
                    <option value="admin">Admin</option>
                    <option value="teacher">Teacher</option>
                    <option value="staff">Staff</option>
                  </select>
                </div>
                <select
                  className="rounded-xl border border-slate-200 bg-white px-2 py-1.5 text-sm"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="name">Sort: Name</option>
                  <option value="role">Sort: Role</option>
                  <option value="staffId">Sort: Staff ID</option>
                </select>
              </div>
            </div>
          </section>

          {/* Table */}
          <section className="rounded-2xl overflow-hidden border border-slate-200/60 bg-white/80 backdrop-blur shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gradient-to-r from-sky-500 to-indigo-600 text-white">
                  <tr>
                    <Th>Staff ID</Th>
                    <Th>Name</Th>
                    <Th>Email</Th>
                    <Th>Role</Th>
                    <Th>Phone</Th>
                    <Th className="text-right">Actions</Th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="py-10 text-center text-slate-500">
                        <Loader2 className="inline animate-spin mr-2" /> Loading staff…
                      </td>
                    </tr>
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-10 text-center text-slate-500">No staff found.</td>
                    </tr>
                  ) : (
                    filtered.map((s) => (
                      <tr key={s._id} className="border-b last:border-b-0 border-slate-100/70">
                        <Td>{s.staffId || "—"}</Td>
                        <Td>
                          <div className="font-medium text-slate-800">{s.name}</div>
                          <div className="text-[11px] text-slate-500">{s.gender || ""}</div>
                        </Td>
                        <Td className="text-slate-600">{s.email}</Td>
                        <Td>
                          <span className={
                            "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] " +
                            (s.role === "admin"
                              ? "bg-indigo-50 text-indigo-700 border border-indigo-100"
                              : s.role === "teacher"
                              ? "bg-purple-50 text-purple-700 border border-purple-100"
                              : "bg-emerald-50 text-emerald-700 border border-emerald-100")
                          }>
                            {s.role}
                          </span>
                        </Td>
                        <Td className="text-slate-600">{s.phonenumber || "—"}</Td>
                        <Td className="text-right">
                          <div className="inline-flex gap-2">
                            <button className="rounded-lg border border-slate-200 px-2.5 py-1.5 hover:bg-slate-50">Edit</button>
                            <button className="rounded-lg bg-rose-500 text-white px-2.5 py-1.5 hover:bg-rose-600">Delete</button>
                          </div>
                        </Td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {error && (
              <div className="border-t border-rose-100 bg-rose-50 text-rose-700 px-4 py-2 text-sm">{error}</div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

function NavItem({ icon, label, active }) {
  return (
    <button
      className={
        "w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm " +
        (active
          ? "bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow"
          : "text-slate-700 hover:bg-slate-50 border border-transparent")
      }
    >
      <span className="shrink-0">{icon}</span>
      <span className="truncate">{label}</span>
    </button>
  );
}

function KpiCard({ icon, label, value, sub }) {
  return (
    <div className="rounded-2xl border border-slate-200/60 bg-white/80 backdrop-blur shadow-sm p-4">
      <div className="flex items-center justify-between">
        <div className="text-slate-500">{icon}</div>
        <div className="text-xs text-slate-400">{sub}</div>
      </div>
      <div className="mt-2 text-2xl font-semibold tracking-tight">{value}</div>
      <div className="text-sm text-slate-600">{label}</div>
    </div>
  );
}

function Th({ children, className = "" }) {
  return (
    <th className={`text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider ${className}`}>
      {children}
    </th>
  );
}

function Td({ children, className = "" }) {
  return (
    <td className={`px-4 py-3 align-middle ${className}`}>{children}</td>
  );
}

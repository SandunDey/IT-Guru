// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { studentApi } from "./api"; // NOTE: ../api (not ./api)

export default function Login() {
  const nav = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [role, setRole] = useState("Student"); // dropdown eka visible nam
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const change = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  async function onLogin(e) {
    e.preventDefault();
    setErr("");

    // optional: ensure we only allow Student from this screen
    if (role.toLowerCase() !== "student") {
      return setErr("Please select role: Student to sign in here.");
    }

    setLoading(true);
    try {
      // Backend: POST /api/student/login -> { token, student }
      const { data } = await studentApi.post("/login", form);
      const token = data?.token;
      const student = data?.student;

      if (!token || !student) throw new Error("Invalid login response");

      // Save in the exact shape the dashboard expects
      localStorage.setItem(
        "app_auth",
        JSON.stringify({ token, user: { role: "student", ...student } })
      );
      // (legacy keys if other parts still read them)
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify({ role: "student", ...student }));

      // Let other tabs / components know auth changed
      window.dispatchEvent(new Event("auth:updated"));

      // Go to student dashboard
      nav("/StudentDashboard", { replace: true });
    } catch (e) {
      setErr(e?.response?.data?.message || e?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-slate-50">
      {/* left side hero (optional) */}
      <div className="hidden md:block relative">
        {/* ... your hero image / branding ... */}
      </div>

      {/* right side form */}
      <div className="flex items-center justify-center p-6">
        <form onSubmit={onLogin} className="w-full max-w-md bg-white rounded-2xl p-6 shadow">
          <div className="text-center mb-4">
            <div className="mx-auto h-12 w-12 rounded-xl bg-red-100 grid place-items-center mb-2">🛡️</div>
            <h1 className="text-2xl font-bold">Sign In</h1>
            <p className="text-slate-500 text-sm">Access your dashboard</p>
          </div>

          {/* Role (if you show it) */}
          <label className="block text-sm font-medium mb-1">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full mb-3 rounded-xl border px-3 py-2"
          >
            <option>Student</option>
            <option>Teacher</option>
            <option>Admin</option>
          </select>

          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={change("email")}
            required
            className="w-full mb-3 rounded-xl border px-3 py-2"
            placeholder="you@email.com"
          />

          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            value={form.password}
            onChange={change("password")}
            required
            className="w-full mb-3 rounded-xl border px-3 py-2"
            placeholder="••••••••"
          />

          {err && (
            <div className="mb-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-red-700 text-sm">
              {err}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 text-white font-semibold py-3 hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>

          <div className="mt-4 text-center text-sm">
            <Link to="/signup" className="inline-block w-full border rounded-xl py-3 hover:bg-slate-50">
              Create account
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

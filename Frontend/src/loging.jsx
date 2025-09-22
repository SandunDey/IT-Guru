// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { studentApi } from "./api";

export default function Login() {
  const nav = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [role, setRole] = useState("Student");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const change = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  async function onLogin(e) {
    e.preventDefault();
    setErr("");
    if (role.toLowerCase() !== "student") {
      return setErr("Please select role: Student to sign in here.");
    }
    setLoading(true);
    try {
      const { data } = await studentApi.post("/login", form);
      const token = data?.token;
      const student = data?.student;
      if (!token || !student) throw new Error("Invalid login response");
      localStorage.setItem(
        "app_auth",
        JSON.stringify({ token, user: { role: "student", ...student } })
      );
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify({ role: "student", ...student }));
      window.dispatchEvent(new Event("auth:updated"));
      nav("/StudentDashboard", { replace: true });
    } catch (e) {
      setErr(e?.response?.data?.message || e?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-blue-900 via-blue-700 to-white">
      {/* Animated fade background blobs */}
      <motion.div
        className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-blue-400/20 blur-3xl"
        animate={{ x: [0, 40, 0], y: [0, 20, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-24 -right-24 h-[28rem] w-[28rem] rounded-full bg-blue-200/30 blur-3xl"
        animate={{ x: [0, -30, 0], y: [0, -15, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Centered form only */}
      <motion.form
        onSubmit={onLogin}
        className="relative z-10 w-full max-w-md rounded-3xl border border-white/10 bg-white/90 p-6 shadow-2xl backdrop-blur-xl md:p-8"
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
      >
        <motion.div variants={fadeUp} className="mb-6 text-center">
          <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-blue-200 ring-1 ring-white/10">
            <span className="text-xl">🛡️</span>
          </div>
          <h1 className="text-2xl font-bold text-blue-900">Sign In</h1>
          <p className="text-sm text-blue-700">Access your dashboard</p>
        </motion.div>

        <motion.div variants={fadeUp} className="mb-4">
          <label className="mb-1 block text-sm font-medium text-blue-900">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full rounded-2xl border border-blue-200 bg-white px-3 py-2 text-blue-900 shadow-inner outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option>Student</option>
            <option>Teacher</option>
            <option>Admin</option>
          </select>
        </motion.div>

        <motion.div variants={fadeUp} className="mb-4">
          <label className="mb-1 block text-sm font-medium text-blue-900">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={change("email")}
            required
            placeholder="you@email.com"
            className="w-full rounded-2xl border border-blue-200 bg-white px-3 py-2 text-blue-900 placeholder-blue-400 shadow-inner outline-none focus:ring-2 focus:ring-blue-400"
          />
        </motion.div>

        <motion.div variants={fadeUp} className="mb-4">
          <label className="mb-1 block text-sm font-medium text-blue-900">Password</label>
          <input
            type="password"
            value={form.password}
            onChange={change("password")}
            required
            placeholder="••••••••"
            className="w-full rounded-2xl border border-blue-200 bg-white px-3 py-2 text-blue-900 placeholder-blue-400 shadow-inner outline-none focus:ring-2 focus:ring-blue-400"
          />
        </motion.div>

        {err && (
          <motion.div variants={fadeUp} className="mb-4 rounded-2xl border border-red-300 bg-red-100 px-3 py-2 text-sm text-red-700">
            {err}
          </motion.div>
        )}

        <motion.button
          type="submit"
          disabled={loading}
          variants={fadeUp}
          className="group relative mt-2 w-full overflow-hidden rounded-2xl bg-blue-600 px-4 py-3 font-semibold text-white shadow-lg outline-none transition hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 disabled:opacity-60"
        >
          <span className="relative z-10">{loading ? "Signing in…" : "Sign in"}</span>
          <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition group-hover:translate-x-0" />
        </motion.button>

        <motion.div variants={fadeUp} className="mt-6 text-center text-sm">
          <Link
            to="/signup"
            className="inline-block w-full rounded-2xl border border-blue-200 bg-white px-4 py-3 text-blue-700 transition hover:bg-blue-50"
          >
            Create account
          </Link>
        </motion.div>
      </motion.form>
    </div>
  );
}
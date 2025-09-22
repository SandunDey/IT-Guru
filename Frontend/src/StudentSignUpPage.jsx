// src/pages/Signup.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { studentApi } from "./api";

const emailRe = /^\S+@\S+\.\S+$/;
const phoneRe = /^\+?[0-9]{10,15}$/;
const nicRe = /^([0-9]{9}[VX]|[0-9]{12})$/i;

export default function Signup() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  const [form, setForm] = useState({
    name: "",
    address: "",
    year: "",
    nic: "",
    birthday: "",
    gender: "Male",
    email: "",
    password: "",
    confirmPassword: "",
    phonenumber: "",
  });

  const change = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  async function onSignup(e) {
    e.preventDefault();
    setErr("");
    setOk("");

    if (!emailRe.test(form.email)) return setErr("තහවුරු Email එකක් දාන්න.");
    if (!phoneRe.test(form.phonenumber)) return setErr("Phone number වැරදිය.");
    if (!nicRe.test(form.nic)) return setErr("NIC format වැරදිය.");
    if (form.password.length < 6) return setErr("Password අකුරු 6+ විය යුතුයි.");
    if (form.password !== form.confirmPassword) return setErr("Passwords ගැලපෙන්නේ නෑ.");

    setLoading(true);
    try {
      // Create account
      await studentApi.post("/", form);

      // Auto-login for smooth UX
      const loginRes = await studentApi.post("/login", {
        email: form.email,
        password: form.password,
      });

      if (loginRes.data?.token) {
        localStorage.setItem(
          "app_auth",
          JSON.stringify({ token: loginRes.data.token, user: { role: "student", ...loginRes.data.student } })
        );
        localStorage.setItem("token", loginRes.data.token);
        localStorage.setItem("user", JSON.stringify({ role: "student", ...loginRes.data.student }));
        setOk("Account created successfully! Redirecting…");
        nav("/admin");
      } else {
        setOk("Account created. දැන් login වෙන්න.");
      }
    } catch (e) {
      setErr(e?.response?.data?.message || "Signup error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-50 p-4">
      <div className="w-full max-w-2xl bg-white/90 backdrop-blur rounded-2xl shadow-xl border border-blue-200">
        {/* Header */}
        <div className="px-8 pt-8 pb-4 text-center">
          <h1 className="text-3xl font-extrabold text-blue-700">Create Student Account</h1>
          
        </div>

        {/* Status */}
        {(err || ok) && (
          <div className="px-8">
            {err && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700 text-sm">
                {err}
              </div>
            )}
            {ok && (
              <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-700 text-sm">
                {ok}
              </div>
            )}
          </div>
        )}

        {/* Form */}
        <form onSubmit={onSignup} className="px-8 pb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-blue-900 mb-1">Full Name</label>
            <input
              className="w-full rounded-xl border border-blue-200 bg-white px-3 py-2 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition"
              value={form.name}
              onChange={change("name")}
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-blue-900 mb-1">Address</label>
            <input
              className="w-full rounded-xl border border-blue-200 bg-white px-3 py-2 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition"
              value={form.address}
              onChange={change("address")}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-blue-900 mb-1">Batch</label>
            <input
              className="w-full rounded-xl border border-blue-200 bg-white px-3 py-2 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition"
              value={form.year}
              onChange={change("year")}
              placeholder="e.g., 2025 A/L"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-blue-900 mb-1">NIC</label>
            <input
              className="w-full rounded-xl border border-blue-200 bg-white px-3 py-2 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition"
              value={form.nic}
              onChange={change("nic")}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-blue-900 mb-1">Birthday</label>
            <input
              type="date"
              className="w-full rounded-xl border border-blue-200 bg-white px-3 py-2 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition"
              value={form.birthday}
              onChange={change("birthday")}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-blue-900 mb-1">Gender</label>
            <select
              className="w-full rounded-xl border border-blue-200 bg-white px-3 py-2 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition"
              value={form.gender}
              onChange={change("gender")}
              required
            >
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-blue-900 mb-1">Email</label>
            <input
              type="email"
              className="w-full rounded-xl border border-blue-200 bg-white px-3 py-2 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition"
              value={form.email}
              onChange={change("email")}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-blue-900 mb-1">Phone Number</label>
            <input
              className="w-full rounded-xl border border-blue-200 bg-white px-3 py-2 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition"
              value={form.phonenumber}
              onChange={change("phonenumber")}
              placeholder="+9471XXXXXXX"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-blue-900 mb-1">Password</label>
            <input
              type="password"
              className="w-full rounded-xl border border-blue-200 bg-white px-3 py-2 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition"
              value={form.password}
              onChange={change("password")}
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-blue-900 mb-1">Confirm Password</label>
            <input
              type="password"
              className="w-full rounded-xl border border-blue-200 bg-white px-3 py-2 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition"
              value={form.confirmPassword}
              onChange={change("confirmPassword")}
              required
            />
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl px-4 py-3 font-semibold bg-blue-600 text-white shadow hover:bg-blue-700 active:scale-[.99] disabled:opacity-60 disabled:cursor-not-allowed transition"
            >
              {loading ? "Creating…" : "Create Account"}
            </button>
          </div>
        </form>

        {/* Footer: link to login if needed */}
        <div className="px-8 pb-8 -mt-4">
          <p className="text-sm text-blue-900/70 text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-700 hover:underline font-medium">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

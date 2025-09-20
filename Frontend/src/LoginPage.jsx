import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import Logo from "./assets/logo.jpg";

// Prefer Vite env; fallback to common defaults
const RAW_BASE =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_BASE_URL) ||
  (typeof process !== "undefined" && process.env?.REACT_APP_API_BASE_URL) ||
  "http://localhost:4000"; // sensible dev default

const API_BASE = RAW_BASE.replace(/\/$/, ""); // strip trailing slash

// Optional: axios instance
const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // read flash from signup redirect
  const flash = location.state?.flash;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      // ✅ Correct path: /api/students/login
      const res = await api.post("/api/students/login", { email, password });

      const token = res?.data?.token;
      if (token) {
        if (remember) localStorage.setItem("itguru_token", token),localStorage.setItem(user);
        else sessionStorage.setItem("itguru_token", token);

        // you can also persist basic student info if needed:
        // localStorage.setItem("student", JSON.stringify(res.data.student));

        // ✅ Route that exists in your App.jsx
        navigate("/admindashboard", { replace: true });
        return;
      }

      // fallback if no token returned
      setError(res?.data?.message || "Login failed. Please try again.");
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Login failed. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "linear-gradient(to right, #ffffff, #dbeafe, #1e40af)" }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-10">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <img
            src={Logo}
            alt="IT Guru Logo"
            className="h-16 w-16 rounded-full object-cover shadow-lg"
          />
          <h1 className="mt-6 text-3xl font-bold text-black">Welcome back</h1>
          <p className="mt-2 text-sm text-gray-600">Log in to your Student account</p>
        </div>

        {/* Flash from signup */}
        {flash && (
          <div className="mb-4 rounded-lg border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {flash}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-black">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@itguru.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 block w-full rounded-lg border border-gray-300 px-4 py-3 text-black placeholder-gray-400 focus:ring-2 focus:ring-blue-600 focus:outline-none"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-black">
              Password
            </label>
            <div className="relative mt-2">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 text-black placeholder-gray-400 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute inset-y-0 right-3 my-auto text-sm text-blue-600 font-medium hover:underline"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="inline-flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
              />
              Remember me
            </label>
            <a href="/forgot-password" className="text-sm font-medium text-blue-600 hover:underline">
              Forgot password?
            </a>
          </div>

          {error && (
            <div className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 text-white py-3 font-semibold hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <div className="mt-8 flex items-center gap-3 text-sm text-gray-400">
          <div className="h-px flex-1 bg-gray-200" />
          <span>or</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => navigate("/signup")}
            className="rounded-lg border border-gray-300 py-2.5 text-center text-sm font-medium text-black hover:bg-gray-50"
          >
            Create account
          </button>
          <a
            href="/support"
            className="rounded-lg border border-gray-300 py-2.5 text-center text-sm font-medium text-black hover:bg-gray-50"
          >
            Get support
          </a>
        </div>

        <p className="mt-8 text-center text-xs text-gray-500">
          By continuing you agree to IT Guru’s{" "}
          <a href="/terms" className="underline">Terms</a> and{" "}
          <a href="/privacy" className="underline">Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
}

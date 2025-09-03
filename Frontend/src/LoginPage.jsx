import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_BASE_URL) ||
  (typeof process !== "undefined" && process.env?.REACT_APP_API_BASE_URL) ||
  "";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${API_BASE}/api/Student/loging`,
        { email, password, remember },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );


      if (res?.data?.token) {
        if (remember) localStorage.setItem("itguru_token", res.data.token);
        else sessionStorage.setItem("itguru_token", res.data.token);
          navigate("/dashboard", { replace: true });
      }


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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-700">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-10">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-600 text-white font-bold text-2xl shadow-lg">
            IT
          </div>
          <h1 className="mt-6 text-3xl font-bold text-black">Welcome back</h1>
          <p className="mt-2 text-sm text-gray-600">
            Log in to your IT Guru account
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-black"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@itguru.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 block w-full rounded-lg border border-gray-300 px-4 py-3 text-black placeholder-gray-400 focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-black"
            >
              Password
            </label>
            <div className="relative mt-2">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 text-black placeholder-gray-400 focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute inset-y-0 right-3 my-auto text-sm text-blue-600 font-medium hover:underline"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Options */}
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
            <a
              href="/forgot-password"
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              Forgot password?
            </a>
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 text-white py-3 font-semibold hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        {/* Divider */}
        <div className="mt-8 flex items-center gap-3 text-sm text-gray-400">
          <div className="h-px flex-1 bg-gray-200" />
          <span>or</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        {/* Secondary */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <a
             onClick={() => navigate("/signup")}
            className="rounded-lg border border-gray-300 py-2.5 text-center text-sm font-medium text-black hover:bg-gray-50"
          >
            Create account
          </a>
          <a
            href="/support"
            className="rounded-lg border border-gray-300 py-2.5 text-center text-sm font-medium text-black hover:bg-gray-50"
          >
            Get support
          </a>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-xs text-gray-500">
          By continuing you agree to IT Guru’s{" "}
          <a href="/terms" className="underline">
            Terms
          </a>{" "}
          and{" "}
          <a href="/privacy" className="underline">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
}

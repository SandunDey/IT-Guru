// src/loging.jsx
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Shield, Mail, Lock, CheckCircle2, AlertCircle, UserPlus } from "lucide-react";
import { loginByRole } from "./api";
import { storeAuth } from "./auth";

import ITGURULogo from "./assets/logo.jpg";
import LoginBG from "./assets/background.jpg";

export default function AdminLoginPage() {
  const [role, setRole] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [caps, setCaps] = useState(false);
  const navigate = useNavigate();
  const pwdRef = useRef(null);

  const validate = () => {
    if (!email.trim()) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Enter a valid email";
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    return "";
  };

  async function onSubmit(e) {
    e.preventDefault();
    if (loading) return; // prevent double submit
    setError("");

    const v = validate();
    if (v) return setError(v);

    try {
      setLoading(true);
      const normalizedRole = (role || "").toLowerCase();
      const { token, user } = await loginByRole(normalizedRole, { email, password });

      if (!token) throw new Error("Login failed: missing token");

      // ensure we always store a role + email
      const finalUser = { role: normalizedRole, email, ...(user || {}) };
      storeAuth(token, finalUser, remember);

      // navigate by role (keep these in sync with your router)
      if (normalizedRole === "admin") navigate("/admin/dashboard/*", { replace: true });
      else if (normalizedRole === "student") navigate("/StudentDashboard", { replace: true, state: { user: finalUser } });
      else if (normalizedRole === "staff") navigate("/staff", { replace: true });
      else if (normalizedRole === "teacher") navigate("/teacher", { replace: true });
      else navigate("/", { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  function onCreateAccount() {
    // currently only student signup? keep role in URL for future use
    navigate(`/signup?role=${encodeURIComponent(role)}`);
  }

  useEffect(() => {
    const onKey = (e) => setCaps(e.getModifierState && e.getModifierState("CapsLock"));
    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("keyup", onKey);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white text-black">
      <div className={`h-0.5 bg-[#e30613] transition-all duration-300 ${loading ? "w-full" : "w-0"}`} />
      <div className="grid min-h-[calc(100vh-2px)] grid-cols-1 md:grid-cols-2">
        {/* LEFT */}
        <div className="relative hidden md:block">
          <img src={LoginBG} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-black/65" />
          <div className="absolute inset-y-0 right-0 w-64 bg-gradient-to-l from-white/0 via-white/5 to-transparent" />
          <div className="relative z-10 flex h-full flex-col items-center justify-center px-10 text-center text-white">
            <img src={ITGURULogo} alt="IT GURU" className="mb-6 h-16 w-16 rounded-xl object-cover ring-2 ring-white/20" />
            <h2 className="text-4xl font-semibold tracking-tight">IT GURU</h2>
            <p className="mt-3 max-w-md text-white/80">Learn smarter. Manage students, teachers, staff and classes.</p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="relative flex items-center justify-center p-6 md:p-10">
          <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute -top-24 -right-20 h-72 w-72 rounded-full bg-gradient-to-br from-[#1D9BF0]/20 to-[#e30613]/20 blur-3xl" />
            <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-gradient-to-tr from-[#e30613]/15 to-[#1D9BF0]/15 blur-3xl" />
          </div>

          <div className="w-full max-w-md">
            <div className="mb-6 flex items-center gap-3 md:hidden">
              <img src={ITGURULogo} alt="IT GURU" className="h-12 w-12 rounded-xl object-cover ring-2 ring-black/5" />
              <div>
                <p className="text-xs uppercase tracking-wider text-[#e30613]">Sign In</p>
                <h1 className="text-lg font-semibold">IT GURU</h1>
              </div>
            </div>

            <div className="rounded-2xl border border-black/10 bg-white/80 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.08)] backdrop-blur">
              <div className="mb-5 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e30613] text-white shadow">
                  <Shield size={20} />
                </div>
                <h2 className="text-2xl font-semibold">Sign In</h2>
                <p className="mt-1 text-sm text-neutral-500">Access your dashboard</p>
              </div>

              <form onSubmit={onSubmit} className="space-y-4">
                <div>
                  <label htmlFor="role" className="mb-1 block text-sm font-medium">Role</label>
                  <div className="relative">
                    <select
                      id="role"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full appearance-none rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none transition focus:border-[#1D9BF0]/40 focus:ring-2 focus:ring-[#1D9BF0]/20"
                    >
                      <option value="student">Student</option>
                      <option value="teacher">Teacher</option>
                      <option value="staff">Staff</option>
                      <option value="admin">Admin</option>
                    </select>
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400">▾</span>
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="mb-1 block text-sm font-medium">Email</label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                    <input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-black/10 bg-white pl-10 pr-3 py-2 text-sm outline-none transition focus:border-[#1D9BF0]/40 focus:ring-2 focus:ring-[#1D9BF0]/20"
                      autoComplete="email"
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <label htmlFor="password" className="block text-sm font-medium">Password</label>
                    {caps && (
                      <span className="flex items-center gap-1 text-[12px] text-amber-600">
                        <AlertCircle size={14} /> Caps Lock is on
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                    <input
                      ref={pwdRef}
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-xl border border-black/10 bg-white pl-10 pr-10 py-2 text-sm outline-none transition focus:border-[#1D9BF0]/40 focus:ring-2 focus:ring-[#1D9BF0]/20"
                      autoComplete="current-password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-neutral-500 hover:bg-neutral-100"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="flex items-start gap-2 rounded-lg border border-[#e30613]/30 bg-[#e30613]/10 px-3 py-2 text-sm text-[#a50711]">
                    <AlertCircle size={16} className="mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="flex items-center justify-between gap-3 pt-1">
                  <label className="inline-flex cursor-pointer select-none items-center gap-2 text-sm text-neutral-700">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                      className="h-4 w-4 rounded border"
                    />
                    Remember me
                  </label>
                  <a href="#" className="text-sm text-neutral-700 underline-offset-4 hover:underline">
                    Forgot password?
                  </a>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="group mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#1D9BF0] px-4 py-2 text-sm font-medium text-white shadow hover:bg-[#1877CC] focus:outline-none focus:ring-4 focus:ring-[#1D9BF0]/30 disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4A4 4 0 004 12z" />
                      </svg>
                      Signing in…
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={16} className="opacity-0 transition group-hover:opacity-100" />
                      Sign in
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={onCreateAccount}
                  className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-medium text-neutral-800 hover:bg-neutral-50 focus:outline-none focus:ring-4 focus:ring-neutral-200"
                >
                  <UserPlus size={16} />
                  Create account
                </button>
              </form>

              <p className="mt-6 text-center text-xs text-neutral-500">
                © {new Date().getFullYear()} IT GURU. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// AdminLoginPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Shield } from "lucide-react";


import ITGURULogo from "../src/assets/logo.jpg";
import LoginBG from "../src/assets/background.jpg"; // <- your left-panel background

export default function AdminLoginPage() {
  const [role, setRole] = useState("admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const validate = () => {
    if (!email.trim()) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Enter a valid email";
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    return "";
  };

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    const v = validate();
    if (v) return setError(v);
    try {
      setLoading(true);
      const { token, user } = await login({ role, email, password });
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      navigate(user.role.toLowerCase() === "admin" ? "/admin" : "/", {
        replace: true,
      });
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white text-black">
      {/* top progress bar */}
      <div
        className={`h-0.5 bg-[#e30613] transition-all duration-300 ${
          loading ? "w-full" : "w-0"
        }`}
      />

      <div className="grid min-h-[calc(100vh-2px)] grid-cols-1 md:grid-cols-2">
        {/* LEFT SIDE with background image */}
        <div className="relative hidden md:block">
          {/* image layer */}
          <img
            src={LoginBG}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
          />
          {/* dark overlay for readability */}
          <div className="absolute inset-0 bg-black/75" />
          {/* text content on top */}
          <div className="relative z-10 flex h-full flex-col items-center justify-center px-10 text-center text-white">
            <h2 className="text-3xl font-semibold tracking-tight">IT GURU</h2>
            <p className="mt-2 max-w-md text-white/80">
             Learn smarter. Manage students, teachers, and classes in one place
            </p>
          </div>
        </div>

        {/* RIGHT SIDE (form) */}
        <div className="flex items-center justify-center p-6 md:p-10">
          <div className="w-full max-w-md">
            {/* header (mobile) */}
            <div className="mb-6 flex items-center gap-3 md:hidden">
                 <img src={ITGURULogo} alt="IT GURU" className="h-12 w-12" />
              <div>
                <p className="text-xs uppercase tracking-wider text-[#e30613]">Admin</p>
                <h1 className="text-lg font-semibold">IT GURU</h1>
              </div>
            </div>

            {/* card */}
            <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
              <div className="mb-5 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e30613] text-white shadow">
                  <Shield size={20} />
                </div>
                <h2 className="text-2xl font-semibold">Admin Sign In</h2>
                <p className="mt-1 text-sm text-neutral-500">Access the IT GURU dashboard</p>
              </div>

              <form onSubmit={onSubmit}>
                <div className="mb-4">
                  <label htmlFor="role" className="mb-1 block text-sm font-medium">Role</label>
                  <select
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm focus:ring-2 focus:ring-[#e30613]/30"
                  >
                    <option value="admin">Admin</option>
                    <option value="teacher">Teacher</option>
                    <option value="staffmember">Staff Member</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label htmlFor="email" className="mb-1 block text-sm font-medium">Email</label>
                  <input
                    id="email"
                    type="email"
                    placeholder="you@it-guru.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm focus:ring-2 focus:ring-[#e30613]/30"
                  />
                </div>

                <div className="mb-2">
                  <label htmlFor="password" className="mb-1 block text-sm font-medium">Password</label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-xl border border-black/10 px-3 py-2 pr-10 text-sm focus:ring-2 focus:ring-[#e30613]/30"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-black"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="mb-4 rounded-lg border border-[#e30613]/30 bg-[#e30613]/10 px-3 py-2 text-sm text-[#a50711]">
                    {error}
                  </div>
                )}

                <div className="mt-4 flex items-center justify-between gap-3">
                  <label className="inline-flex items-center gap-2 text-sm text-neutral-600">
                    <input type="checkbox" className="h-4 w-4 rounded border" />
                    Remember me
                  </label>
                  <a href="#" className="text-sm text-neutral-600 underline-offset-4 hover:underline">
                    Forgot password?
                  </a>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-6 w-full rounded-xl bg-[#1D9BF0] px-4 py-2 text-sm font-medium text-white shadow hover:bg-[#1877CC] disabled:opacity-60"

                >
                  {loading ? "Signing in…" : "Sign in"}
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

// temporary login
async function login({ role, email, password }) {
  await new Promise((res) => setTimeout(res, 800));
  return { token: "fake-token", user: { role, email } };
}

// src/loging.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Eye,
  EyeOff,
  Shield,
  Mail,
  Lock,
  AlertCircle,
  UserPlus,
} from "lucide-react";

import ITGURULogo from "./assets/logo.jpg";
import LoginBG from "./assets/background.jpg";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function LoginPage() {
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

  async function onLogin(e) {
    e.preventDefault();
    if (loading) return;
    setError("");

    const v = validate();
    if (v) return setError(v);

    try {
      setLoading(true);

    
      // ✅ Pick correct API endpoint
      let url = "";
      switch (role.toLowerCase()) {
        case "admin":
          url = `${API_BASE}/api/admin/login`;
          break;
        case "student":
          url = `${API_BASE}/api/student/login`;
          break;
        case "teacher":
          url = `${API_BASE}/api/teacher/login`;
          break;
        default:
          throw new Error("Invalid role selected");
      }



      const res = await axios.post(url, { email, password });
const { token, user, student, teacher } = res.data;
const finalUser = user || student || teacher;

      if (!finalUser) throw new Error("Login failed");

      // ✅ Save to storage
const storage = remember ? localStorage : sessionStorage;
if (token) storage.setItem("authToken", token);

// Always attach role, fallback to selected role
const userWithRole = { ...finalUser, role: finalUser.role || role };
storage.setItem("authUser", JSON.stringify(userWithRole));

// ✅ Navigate by role (if/else)
if (userWithRole.role.toLowerCase() === "admin") {
  navigate("/admin/dashboard", { replace: true });
} else if (userWithRole.role.toLowerCase() === "student") {
  navigate("/StudentDashboard", { replace: true });
} else if (userWithRole.role.toLowerCase() === "teacher") {
  navigate("/teacher", { replace: true });
} else {
  navigate("/", { replace: true });
}

    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  function onCreateAccount() {
    navigate(`/signup?role=${encodeURIComponent(role)}`);
  }

  useEffect(() => {
    const onKey = (e) =>
      setCaps(e.getModifierState && e.getModifierState("CapsLock"));
    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("keyup", onKey);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white text-black">
      <div
        className={`h-0.5 bg-[#e30613] transition-all duration-300 ${
          loading ? "w-full" : "w-0"
        }`}
      />
      <div className="grid min-h-[calc(100vh-2px)] grid-cols-1 md:grid-cols-2">
        {/* LEFT */}
        <div className="relative hidden md:block">
          <img
            src={LoginBG}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/65" />
          <div className="relative z-10 flex h-full flex-col items-center justify-center px-10 text-center text-white">
            <img
              src={ITGURULogo}
              alt="IT GURU"
              className="mb-6 h-16 w-16 rounded-xl object-cover ring-2 ring-white/20"
            />
            <h2 className="text-4xl font-semibold tracking-tight">IT GURU</h2>
            <p className="mt-3 max-w-md text-white/80">
              Learn smarter. Manage students, teachers, staff and classes.
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="relative flex items-center justify-center p-6 md:p-10">
          <div className="w-full max-w-md">
            <div className="rounded-2xl border border-black/10 bg-white/80 p-6 shadow backdrop-blur">
              <div className="mb-5 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e30613] text-white shadow">
                  <Shield size={20} />
                </div>
                <h2 className="text-2xl font-semibold">Sign In</h2>
              </div>

              <form onSubmit={onLogin} className="space-y-4">
                {/* Role */}
                <div>
                  <label className="mb-1 block text-sm font-medium">Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm"
                  >
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                {/* Email */}
                <div>
                  <label className="mb-1 block text-sm font-medium">Email</label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border px-3 py-2 text-sm"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium">Password</label>
                  <div className="relative">
                    <input
                      ref={pwdRef}
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-xl border pl-3 pr-10 py-2 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {caps && (
                    <span className="text-xs text-amber-600 mt-1">
                      <AlertCircle size={14} /> Caps Lock is on
                    </span>
                  )}
                </div>

                {/* Error */}
                {error && (
                  <div className="text-sm text-red-600">{error}</div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 w-full rounded-xl bg-blue-500 py-2 text-white"
                >
                  {loading ? "Signing in..." : "Sign in"}
                </button>

                <button
                  type="button"
                  onClick={onCreateAccount}
                  className="mt-3 w-full rounded-xl border py-2 text-sm font-medium"
                >
                  <UserPlus size={16} /> Create account
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

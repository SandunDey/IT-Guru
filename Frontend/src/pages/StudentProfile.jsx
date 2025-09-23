// src/pages/StudentProfile.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

/* ---------------- CONFIG (unchanged) ---------------- */
const API = "http://localhost:4000/api/student";
const emailRegex = /^\S+@\S+\.\S+$/;
const phoneRegex = /^\+?[0-9]{10,15}$/;
const nicRegex = /^([0-9]{9}[VX]|[0-9]{12})$/i;

export default function StudentProfile() {
  const navigate = useNavigate();
  const location = useLocation();

  const fallbackId = useMemo(() => {
    try {
      const auth = JSON.parse(localStorage.getItem("app_auth") || "{}");
      return auth?.user?.studentId || auth?.user?._id || "";
    } catch {
      return "";
    }
  }, []);
  const studentId = location.state?.studentId || fallbackId;

  const [form, setForm] = useState({
    name: "",
    address: "",
    year: 2025,
    nic: "",
    birthday: "",
    gender: "Male",
    email: "",
    phonenumber: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const http = useMemo(() => {
    const inst = axios.create({
      baseURL: API,
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    });
    inst.interceptors.request.use((config) => {
      try {
        const { token } = JSON.parse(localStorage.getItem("app_auth") || "{}");
        if (token) config.headers.Authorization = `Bearer ${token}`;
      } catch {}
      return config;
    });
    return inst;
  }, []);

  useEffect(() => {
    if (!studentId) {
      setError("Student ID not found. Please log in again.");
      setLoading(false);
      return;
    }
    let mounted = true;
    setLoading(true);
    setError("");
    http
      .get(`/${studentId}`)
      .then((res) => {
        if (!mounted) return;
        const d = res.data || {};
        setForm((f) => ({
          ...f,
          name: d.name || "",
          address: d.address || "",
          year: d.year || 2025,
          nic: d.nic || "",
          birthday: d.birthday ? String(d.birthday).substring(0, 10) : "",
          gender: d.gender || "Male",
          email: d.email || "",
          phonenumber: d.phonenumber || "",
          password: "",
          confirmPassword: "",
        }));
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err?.response?.data?.message || "Failed to load student profile");
      })
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [studentId, http]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: name === "year" ? Number(value) : value }));
  };

  const validate = () => {
    if (!form.name.trim()) return "Name is required";
    if (!form.address.trim()) return "Address is required";
    if (!emailRegex.test(form.email)) return "Invalid email";
    if (!phoneRegex.test(form.phonenumber)) return "Invalid phone number";
    if (!nicRegex.test(form.nic)) return "Invalid NIC";
    if (form.year < 2025) return "Year must be 2025 or later";
    if (form.password || form.confirmPassword) {
      if (form.password.length < 6) return "Password must be at least 6 characters";
      if (form.password !== form.confirmPassword) return "Passwords do not match";
    }
    return "";
  };

  const onSave = (e) => {
    e.preventDefault();
    const msg = validate();
    if (msg) return setError(msg);

    setSaving(true);
    setError("");
    const payload = {
      name: form.name,
      address: form.address,
      year: form.year,
      nic: form.nic.toUpperCase(),
      birthday: form.birthday || "",
      gender: form.gender,
      email: form.email.toLowerCase(),
      phonenumber: form.phonenumber,
      password: form.password || undefined,
      confirmPassword: form.confirmPassword || undefined,
    };

    http
      .put(`/${studentId}`, payload)
      .then((res) => {
        try {
          const auth = JSON.parse(localStorage.getItem("app_auth") || "{}");
          if (auth?.user) {
            localStorage.setItem(
              "app_auth",
              JSON.stringify({ ...auth, user: { ...auth.user, ...(res.data?.student || {}) } })
            );
            window.dispatchEvent(new Event("auth:updated"));
          }
        } catch {}
        alert("✅ Profile updated!");
        navigate(-1);
      })
      .catch((err) => setError(err?.response?.data?.message || "Update failed"))
      .finally(() => setSaving(false));
  };

  const avatarSeed = encodeURIComponent(form.email || form.name || "student");

  if (loading) {
    return (
      <Shell title="My Profile">
        <div className="animate-pulse grid gap-4">
          <div className="h-28 rounded-2xl bg-slate-100" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-12 rounded-xl bg-slate-100" />
            ))}
          </div>
        </div>
      </Shell>
    );
  }

  return (
    <Shell title="User Profile">
      {/* Header card */}
      <div className="mb-6 rounded-2xl border bg-gradient-to-r from-blue-50 to-indigo-50 p-5 shadow-sm animate-in slide-in-from-bottom-2 fade-in">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={`https://i.pravatar.cc/80?u=${avatarSeed}`}
              alt="avatar"
              className="h-16 w-16 rounded-full border shadow-sm ring-4 ring-white"
            />
            <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-blue-500 ring-2 ring-white" />
          </div>
          <div className="min-w-0">
            <h2 className="truncate text-xl font-semibold text-slate-900">{form.name || "Student"}</h2>
            <p className="text-slate-600">
              <span className="text-xs uppercase tracking-wide">Student ID</span>{" "}
              <span className="font-medium">{studentId || "-"}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 animate-in fade-in">
          {error}
        </div>
      )}

      {/* Form card */}
      <form
        onSubmit={onSave}
        className="rounded-2xl border bg-white p-5 shadow-sm animate-in fade-in slide-in-from-bottom-2"
      >
        <SectionTitle title="Basic Info" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Full Name" name="name" value={form.name} onChange={onChange} required />
          <Input label="Email" name="email" value={form.email} onChange={onChange} type="email" required />
          <Input label="Address" name="address" value={form.address} onChange={onChange} />
          <Input
            label="Phone Number"
            name="phonenumber"
            value={form.phonenumber}
            onChange={onChange}
            placeholder="+9471XXXXXXX"
          />
          <Input label="NIC" name="nic" value={form.nic} onChange={onChange} placeholder="200012345678" />
          <Select
            label="Gender"
            name="gender"
            value={form.gender}
            onChange={onChange}
            options={["Male", "Female", "Other"]}
          />
          <Input label="Batch" name="year" value={form.year} onChange={onChange} type="string" min={2025} />
          <Input label="Birthday" name="birthday" value={form.birthday} onChange={onChange} type="date" />
        </div>

        <Divider />

        <SectionTitle title="Security" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="New Password (optional)"
            name="password"
            value={form.password}
            onChange={onChange}
            type="password"
          />
          <Input
            label="Confirm New Password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={onChange}
            type="password"
          />
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="group relative overflow-hidden rounded-xl bg-blue-600 px-5 py-2 text-white font-medium
                       shadow-sm transition focus:outline-none focus:ring-4 focus:ring-blue-200
                       hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <span className="relative z-10">{saving ? "Saving…" : "Save Changes"}</span>
            <span className="pointer-events-none absolute inset-0 -translate-x-full bg-white/10 group-hover:translate-x-0 transition-transform" />
          </button>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-xl border px-5 py-2 font-medium text-slate-700 hover:bg-slate-50
                       transition shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-200"
          >
            Cancel
          </button>

          <span className="ml-auto text-sm text-slate-500">Last synced with database just now</span>
        </div>
      </form>

      {/* decorative glow */}
      <div className="pointer-events-none fixed -z-10 -top-40 right-0 h-80 w-80 rounded-full bg-blue-200/40 blur-3xl" />
      <div className="pointer-events-none fixed -z-10 bottom-0 -left-20 h-72 w-72 rounded-full bg-indigo-200/30 blur-3xl" />
    </Shell>
  );
}

/* -------------------------- UI BITS (restyled only) -------------------------- */

function Shell({ title, children }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-white">
      <header className="sticky top-0 z-30 border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-5xl px-4 h-14 flex items-center">
          <h1 className="text-lg font-semibold text-slate-900">{title}</h1>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
    </div>
  );
}

function SectionTitle({ title }) {
  return (
    <div className="mb-4 mt-1 flex items-center gap-3">
      <div className="h-6 w-1.5 rounded-full bg-blue-500" />
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
    </div>
  );
}

function Divider() {
  return <div className="my-6 h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent" />;
}

function Input({ label, ...props }) {
  return (
    <label className="group grid gap-1">
      <span className="text-sm text-slate-600">{label}</span>
      <input
        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900
                   outline-none shadow-xs transition
                   focus:border-blue-400 focus:ring-4 focus:ring-blue-200/50
                   hover:border-slate-300"
        {...props}
      />
    </label>
  );
}

function Select({ label, name, value, onChange, options = [] }) {
  return (
    <label className="group grid gap-1">
      <span className="text-sm text-slate-600">{label}</span>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900
                   outline-none shadow-xs transition
                   focus:border-blue-400 focus:ring-4 focus:ring-blue-200/50
                   hover:border-slate-300"
      >
        {options.map((op) => (
          <option key={op} value={op}>
            {op}
          </option>
        ))}
      </select>
    </label>
  );
}

/* ------ Tiny CSS helpers (no extra libs) for subtle entrance animations ------ */
const style = document.createElement("style");
style.innerHTML = `
  .animate-in { animation-duration: .55s; animation-timing-function: cubic-bezier(.22,.72,.24,1); animation-fill-mode: both; }
  .fade-in { animation-name: fade-in; }
  .slide-in-from-bottom-2 { animation-name: slide-in-from-bottom-2; }
  @keyframes fade-in { from { opacity: 0 } to { opacity: 1 } }
  @keyframes slide-in-from-bottom-2 { from { transform: translateY(8px) } to { transform: translateY(0) } }
`;
document.head.appendChild(style);

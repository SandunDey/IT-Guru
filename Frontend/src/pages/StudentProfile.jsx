// src/pages/StudentProfile.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

// ------- CONFIG -------
const API = "http://localhost:4000/api/student"; // backend base url
const emailRegex = /^\S+@\S+\.\S+$/;
const phoneRegex = /^\+?[0-9]{10,15}$/;
const nicRegex = /^([0-9]{9}[VX]|[0-9]{12})$/i;

export default function StudentProfile() {
  const navigate = useNavigate();
  const location = useLocation();

  // id priority: from route state → from localStorage(app_auth.user.studentId)
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

  // axios instance with optional Bearer token
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

  // Load profile
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
      .get(`/${studentId}`) // GET /api/student/:studentId
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
      .put(`/${studentId}`, payload) // PUT /api/student/:studentId
      .then((res) => {
        // refresh local auth.user if exists
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

  // avatar seed
  const avatarSeed = encodeURIComponent(form.email || form.name || "student");

  if (loading) {
    return (
      <Shell title="My Profile">
        <div className="animate-pulse grid gap-4">
          <div className="h-24 rounded-2xl bg-slate-100" />
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
    <Shell title="My Profile">
      {/* Header card */}
      <div className="mb-5 rounded-2xl border bg-gradient-to-r from-blue-50 to-indigo-50 p-5 shadow-sm">
        <div className="flex items-center gap-4">
          <img
            src={`https://i.pravatar.cc/80?u=${avatarSeed}`}
            alt="avatar"
            className="h-16 w-16 rounded-full border shadow-sm"
          />
          <div className="min-w-0">
            <h2 className="truncate text-xl font-semibold">{form.name || "Student"}</h2>
            <p className="text-slate-600">
              <span className="text-xs uppercase tracking-wide">Student ID</span>{" "}
              <span className="font-medium">{studentId || "-"}</span>
            </p>
          </div>
          <div className="ml-auto hidden sm:flex items-center gap-2">
            {/* <button
              onClick={() => navigate(-1)}
              className="rounded-xl border px-4 py-2 text-sm font-medium hover:bg-white"
            >
              Back
            </button> */}
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
      )}

      {/* Form card */}
      <form onSubmit={onSave} className="rounded-2xl border bg-white p-5 shadow-sm">
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

        {/* Password */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="New Password (optional)" name="password" value={form.password} onChange={onChange} type="password" />
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
            className="rounded-xl bg-blue-600 px-5 py-2 text-white font-medium hover:bg-blue-700 disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-xl border px-5 py-2 font-medium hover:bg-slate-50"
          >
            Cancel
          </button>
          <span className="ml-auto text-sm text-slate-500">Last synced with database just now</span>
        </div>
      </form>
    </Shell>
  );
}

// ------- UI bits -------
function Shell({ title, children }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-30 border-b bg-white/80 backdrop-blur">
        <div className="mx-auto max-w-5xl px-4 h-14 flex items-center">
          <h1 className="text-lg font-semibold">{title}</h1>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <label className="grid gap-1">
      <span className="text-sm text-slate-600">{label}</span>
      <input
        className="rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-200"
        {...props}
      />
    </label>
  );
}

function Select({ label, name, value, onChange, options = [] }) {
  return (
    <label className="grid gap-1">
      <span className="text-sm text-slate-600">{label}</span>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-200"
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

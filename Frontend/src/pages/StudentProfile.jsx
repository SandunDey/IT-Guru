// src/pages/StudentProfile.jsx
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const API_ROOT = import.meta.env.VITE_API_URL || "http://localhost:3000";
const api = axios.create({
  baseURL: `${API_ROOT}/api/student`,
  withCredentials: true,
});

const emailRegex = /^\S+@\S+\.\S+$/;
const phoneRegex = /^\+?[0-9]{10,15}$/;

export default function StudentProfile() {
  const navigate = useNavigate();
  const location = useLocation();

  const stored = useMemo(() => {
    try {
      return (
        JSON.parse(localStorage.getItem("student")) ||
        JSON.parse(localStorage.getItem("user")) ||
        JSON.parse(localStorage.getItem("auth")) ||
        {}
      );
    } catch {
      return {};
    }
  }, []);

  const urlParams = new URLSearchParams(location.search);
  const explicitIdFromURL =
    location.state?.studentId ||
    localStorage.getItem("studentId") ||
    stored?.studentId ||
    stored?.student?.studentId ||
    urlParams.get("id") ||
    "";

  const token =
    localStorage.getItem("token") || stored?.token || stored?.student?.token || "";

  const [form, setForm] = useState({
    studentId: explicitIdFromURL || "",
    name: "",
    address: "",
    year: "",
    nic: "",
    birthday: "",
    gender: "Male",
    email: "",
    phonenumber: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        setLoading(true);
        setError("");

        const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

        // Prefer explicit id → otherwise use /me (token-based)
        let res;
        if (explicitIdFromURL) {
          res = await api.get(`/${encodeURIComponent(explicitIdFromURL)}`, {
            signal: controller.signal,
            headers,
          });
        } else if (token) {
          res = await api.get(`/me`, {
            signal: controller.signal,
            headers,
          });
        } else {
          setError("Missing studentId. Please sign in again.");
          return;
        }

        const data = res.data?.student || res.data || {};
        const isoBirthday = data?.birthday
          ? new Date(data.birthday).toISOString().slice(0, 10)
          : "";

        setForm({
          studentId: data?.studentId ?? explicitIdFromURL,
          name: data?.name ?? "",
          address: data?.address ?? "",
          year: data?.year ?? "",
          nic: data?.nic ?? "",
          birthday: isoBirthday,
          gender: data?.gender ?? "Male",
          email: data?.email ?? "",
          phonenumber: data?.phonenumber ?? "",
        });
      } catch (err) {
        const msg =
          err?.response?.data?.message ||
          err?.message ||
          "Failed to load profile. Please try again later.";
        setError(msg);
      } finally {
        setLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, [explicitIdFromURL, token]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onSave = async (e) => {
    e.preventDefault();

    if (!emailRegex.test(form.email)) return setError("Please enter a valid email address.");
    if (form.phonenumber && !phoneRegex.test(form.phonenumber))
      return setError("Please enter a valid phone number.");

    setSaving(true);
    setError("");

    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
      const payload = {
        name: form.name,
        address: form.address,
        year: Number(form.year),
        nic: form.nic,
        birthday: form.birthday ? new Date(form.birthday) : null,
        gender: form.gender,
        email: form.email,
        phonenumber: form.phonenumber,
      };

      const res = await api.put(`/${encodeURIComponent(form.studentId)}`, payload, { headers });
      const data = res.data?.student || res.data;

      if (data?.studentId) {
        setForm((f) => ({
          ...f,
          ...data,
          birthday: data.birthday ? new Date(data.birthday).toISOString().slice(0, 10) : "",
        }));
      }
      alert("Profile updated successfully.");
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Update failed. Please try again.";
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <p className="text-slate-600">Loading profile…</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl p-6">
      <h1 className="mb-6 text-2xl font-semibold">Student Profile</h1>

      {error && (
        <div className="mb-4 rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={onSave} className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="Student ID">
          <input disabled name="studentId" value={form.studentId} className="input-like" />
        </Field>

        <Field label="Name">
          <input name="name" value={form.name} onChange={onChange} className="input-like" />
        </Field>

        <Field label="Email">
          <input name="email" value={form.email} onChange={onChange} className="input-like" />
        </Field>

        <Field label="Phone Number">
          <input name="phonenumber" value={form.phonenumber} onChange={onChange} className="input-like" />
        </Field>

        <Field label="Year">
          <input type="number" name="year" value={form.year} onChange={onChange} min={2025} max={3000} className="input-like" />
        </Field>

        <Field label="NIC">
          <input name="nic" value={form.nic} onChange={onChange} className="input-like" />
        </Field>

        <Field label="Birthday">
          <input type="date" name="birthday" value={form.birthday} onChange={onChange} className="input-like" />
        </Field>

        <Field label="Gender">
          <select name="gender" value={form.gender} onChange={onChange} className="input-like">
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </Field>

        <div className="col-span-full mt-2 flex gap-3">
          <button type="submit" disabled={saving} className="rounded-md bg-blue-600 px-4 py-2 text-white disabled:opacity-60">
            {saving ? "Saving…" : "Save"}
          </button>
          <button type="button" onClick={() => navigate(-1)} className="rounded-md border px-4 py-2">
            Back
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="mb-1 block text-sm text-slate-600">{label}</span>
      <div className="rounded-lg border bg-white px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-blue-600">
        {children}
      </div>
    </label>
  );
}

const style = document.createElement("style");
style.innerHTML = `.input-like{width:100%;outline:none;background:transparent}`;
document.head.appendChild(style);

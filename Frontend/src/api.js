// src/api.js
import axios from "axios";



/**
 * Base URL
 * - Prefer setting: VITE_API_BASE_URL=http://localhost:3000/api
 * - If you only provide host (e.g., http://localhost:3000), we'll append /api automatically.
 */
const RAW = (import.meta.env?.VITE_API_BASE_URL || "http://localhost:3000/api").replace(/\/$/, "");
export const API_BASE = RAW.endsWith("/api") ? RAW : `${RAW}/api`;

// Axios instance
export const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// ---- Auth header: attach Bearer token if you store it in localStorage under "app_auth"
api.interceptors.request.use((config) => {
  try {
    const stored = JSON.parse(localStorage.getItem("app_auth") || "{}");
    if (stored?.token) {
      config.headers.Authorization = `Bearer ${stored.token}`;
    }
  } catch {
    /* ignore */
  }
  return config;
});

// ---- Small helper to try a primary path and fall back to a legacy/alt path (e.g., /loging)
async function tryPaths(primaryCall, fallbackCall) {
  try {
    return await primaryCall();
  } catch (err) {
    const status = err?.response?.status;
    // Only fall back on clear routing issues
    if (status === 404 || status === 405) {
      return await fallbackCall();
    }
    throw err;
  }
}

/* ==================== STUDENTS ==================== */
// POST /api/student (signup)
export const signUpStudent = (payload) => api.post(`/student`, payload);

// POST /api/student/login  (fallback: /api/student/loging)
export const loginStudent = (payload) =>
  tryPaths(
    () => api.post(`/student/login`, payload),
    () => api.post(`/student/loging`, payload)
  );

// GET /api/student/:studentId
export const getStudentById = (studentId) =>
  api.get(`/student/${encodeURIComponent(studentId)}`);

// PUT /api/student/:studentId
export const updateStudentById = (studentId, payload) =>
  api.put(`/student/${encodeURIComponent(studentId)}`, payload);

/* ===================== STAFF ====================== */
// POST /api/staff/register
export const registerStaff = (payload) => api.post(`/staff/register`, payload);

// POST /api/staff/login  (fallback: /api/staff/loging)
export const loginStaff = (payload) =>
  tryPaths(
    () => api.post(`/staff/login`, payload),
    () => api.post(`/staff/loging`, payload)
  );

// GET /api/staff/viewStaffmember
export const getAllStaff = () => api.get(`/staff/viewStaffmember`);

// GET /api/staff/viewStaffmember/:id
export const getStaffById = (staffId) =>
  api.get(`/staff/viewStaffmember/${encodeURIComponent(staffId)}`);

// PUT /api/staff/updateStaffmember/:id
export const updateStaffById = (staffId, payload) =>
  api.put(`/staff/updateStaffmember/${encodeURIComponent(staffId)}`, payload);

// DELETE /api/staff/deleteStaffmember/:id
export const deleteStaffById = (staffId) =>
  api.delete(`/staff/deleteStaffmember/${encodeURIComponent(staffId)}`);

/* ================= ADMIN & TEACHER ================= */
// POST /api/admin/login (fallback keeps legacy casing)
export const adminLogin = (payload) =>
  tryPaths(
    () => api.post(`/admin/login`, payload),
    () => api.post(`/Admin/login`, payload)
  );

// POST /api/teacher/login (if/when available)
export const loginTeacher = (payload) =>
  tryPaths(
    () => api.post(`/teacher/login`, payload),
    () => api.post(`/Teacher/login`, payload)
  );

// Convenience: GET /api/admin (protected list)
export const getAdmins = () => api.get(`/admin`);

/* ================== ROLE DISPATCH ================== */
export async function loginByRole(role, creds) {
  const r = (role || "").toLowerCase();
  if (r === "student") {
    const { data } = await loginStudent(creds);
    return { token: data?.token, user: { role: "student", ...(data?.student || data?.user || {}) } };
  }
  if (r === "staff") {
    const { data } = await loginStaff(creds);
    return { token: data?.token, user: { role: "staff", ...(data?.staff || data?.user || {}) } };
  }
  if (r === "admin") {
    const { data } = await adminLogin(creds);
    return { token: data?.token, user: { role: "admin", ...(data?.admin || data?.user || {}) } };
  }
  if (r === "teacher") {
    const { data } = await loginTeacher(creds);
    return { token: data?.token, user: { role: "teacher", ...(data?.teacher || data?.user || {}) } };
  }
  throw new Error("Unknown role");
}

export default api;

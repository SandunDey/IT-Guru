// src/api.js
import axios from "axios";

/**
 * Base URL
 * - Prefer setting: VITE_API_BASE_URL=http://localhost:4000/api
 * - If you only provide host (e.g., http://localhost:4000), we'll append /api automatically.
 */
const RAW = (import.meta.env?.VITE_API_BASE_URL || "http://localhost:4000/api").replace(/\/$/, "");
export const API_BASE = RAW.endsWith("/api") ? RAW : `${RAW}/api`;

// ---- Single axios instance
export const api = axios.create({
  baseURL: API_BASE, // -> http://localhost:4000/api by default
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// ---- Auth helpers (uniform place to store/read auth)
export function saveAuth({ token, user }) {
  const payload = { token: token || "", user: user || null };
  localStorage.setItem("app_auth", JSON.stringify(payload));

  // (optional legacy mirrors; keep if other code reads these)
  if (token) localStorage.setItem("token", token);
  if (user) localStorage.setItem("user", JSON.stringify(user));
}

export function loadAuth() {
  try {
    const parsed = JSON.parse(localStorage.getItem("app_auth") || "{}");
    return { token: parsed?.token || "", user: parsed?.user || null };
  } catch {
    return { token: "", user: null };
  }
}

// ---- Attach bearer token from app_auth
api.interceptors.request.use((config) => {
  try {
    const stored = JSON.parse(localStorage.getItem("app_auth") || "{}");
    if (stored?.token) config.headers.Authorization = `Bearer ${stored.token}`;
  } catch { /* ignore */ }
  return config;
});

// ---- Try primary path, then a fallback (for legacy routes like /Student or /loging)
async function tryPaths(primaryCall, fallbackCall) {
  try {
    return await primaryCall();
  } catch (err) {
    const status = err?.response?.status;
    if (status === 404 || status === 405) return await fallbackCall();
    throw err;
  }
}
/* ---------- helpers ---------- */
const unbox = (r) => r?.data?.data ?? r?.data;
const rid = () =>
  (typeof crypto !== "undefined" && crypto.randomUUID)
    ? crypto.randomUUID()
    : (Date.now().toString(36) + Math.random().toString(36).slice(2));


/* ==================== STUDENTS ==================== */

// POST /api/student (signup)
export const studentApi = axios.create({
  baseURL: `${API_BASE}/Student`,
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // ok even if you don't use cookies
});

// attach token if exists
studentApi.interceptors.request.use((config) => {
  try {
    const auth = JSON.parse(localStorage.getItem("app_auth") || "{}");
    if (auth?.token) config.headers.Authorization = `Bearer ${auth.token}`;
  } catch {}
  return config;
});

// GET /api/student/me  (token-based)
export const getMyStudent = () => api.get(`/student/me`);

// GET /api/student/:studentId
export const getStudentById = (studentId) =>
  api.get(`/student/${encodeURIComponent(studentId)}`);

// PUT /api/student/:studentId
export const updateStudentById = (studentId, payload) =>
  api.put(`/student/${encodeURIComponent(studentId)}`, payload);

// PUT /api/student/:studentId/avatar  (multipart)
export const uploadStudentAvatar = (studentId, file) => {
  const fd = new FormData();
  fd.append("avatar", file);
  return api.put(`/student/${encodeURIComponent(studentId)}/avatar`, fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// DELETE /api/student/:studentId/avatar
export const deleteStudentAvatar = (studentId) =>
  api.delete(`/student/${encodeURIComponent(studentId)}/avatar`);

/* ===================== STAFF ====================== */
export const registerStaff = (payload) => api.post(`/staff/register`, payload);

export const loginStaff = (payload) =>
  tryPaths(
    () => api.post(`/staff/login`, payload),
    () => api.post(`/staff/loging`, payload)
  );

export const getAllStaff = () => api.get(`/staff/viewStaffmember`);
export const getStaffById = (staffId) =>
  api.get(`/staff/viewStaffmember/${encodeURIComponent(staffId)}`);
export const updateStaffById = (staffId, payload) =>
  api.put(`/staff/updateStaffmember/${encodeURIComponent(staffId)}`, payload);
export const deleteStaffById = (staffId) =>
  api.delete(`/staff/deleteStaffmember/${encodeURIComponent(staffId)}`);

/* ================= ADMIN & TEACHER ================= */
export const adminLogin = (payload) =>
  tryPaths(
    () => api.post(`/admin/login`, payload),
    () => api.post(`/Admin/login`, payload)
  );

export const loginTeacher = (payload) =>
  tryPaths(
    () => api.post(`/teacher/login`, payload),
    () => api.post(`/Teacher/login`, payload)
  );

export const getAdmins = () => api.get(`/admin`);

/* ================== ROLE DISPATCH ================== */
export async function loginByRole(role, creds) {
  const r = (role || "").toLowerCase();

  if (r === "student") {
    const { data } = await loginStudent(creds);
    const token = data?.token;
    const user = { role: "student", ...(data?.student || data?.user || {}) };
    saveAuth({ token, user });
    return { token, user };
  }

  if (r === "staff") {
    const { data } = await loginStaff(creds);
    const token = data?.token;
    const user = { role: "staff", ...(data?.staff || data?.user || {}) };
    saveAuth({ token, user });
    return { token, user };
  }

  if (r === "admin") {
    const { data } = await adminLogin(creds);
    const token = data?.token;
    const user = { role: "admin", ...(data?.admin || data?.user || {}) };
    saveAuth({ token, user });
    return { token, user };
  }

  if (r === "teacher") {
    const { data } = await loginTeacher(creds);
    const token = data?.token;
    const user = { role: "teacher", ...(data?.teacher || data?.user || {}) };
    saveAuth({ token, user });
    return { token, user };
  }

  throw new Error("Unknown role");
}
/* -------------------- VIDEOS -------------------- */
export const listVideos = (params = {}) =>
  api.get("/videos", { params }).then(unbox);

export const createVideo = (payload = {}) =>
  api.post("/videos", payload).then(unbox);

export const updateVideo = (id, payload) =>
  api.patch(`/videos/${encodeURIComponent(id)}`, payload).then(unbox);

export const removeVideo = (id) =>
  api.delete(`/videos/${encodeURIComponent(id)}`).then(() => true);

export const toggleVideoPublish = (id, published) =>
  api
    .patch(
      `/videos/${encodeURIComponent(id)}/publish`,
      typeof published === "boolean" ? { published } : {}
    )
    .then(unbox);

/* -------------------- MATERIALS -------------------- */
export const listMaterials = (params = {}) =>
  api.get("/materials", { params }).then(unbox);

/** Always send a unique mid to avoid Mongo E11000 on mid:null */
export const createMaterial = (payload = {}) => {
  const mid = payload?.mid ?? `mat_${rid()}`;
  api.post("/materials", { mid, ...payload }).then(unbox);
};

export const updateMaterial = (id, payload) =>
  api.patch(`/materials/${encodeURIComponent(id)}`, payload).then(unbox);

export const removeMaterial = (id) =>
  api.delete(`/materials/${encodeURIComponent(id)}`).then(() => true);

/* -------------------- QUIZZES -------------------- */
export const listQuizzes = (params = {}) =>
  api.get("/quizzes", { params }).then(unbox);

export const createQuiz = (payload = {}) =>
  api.post("/quizzes", payload).then(unbox);

export const updateQuiz = (id, payload) =>
  api.patch(`/quizzes/${encodeURIComponent(id)}`, payload).then(unbox);

export const removeQuiz = (id) =>
  api.delete(`/quizzes/${encodeURIComponent(id)}`).then(() => true);

export const toggleQuizPublish = (id) =>
  api.post(`/quizzes/${encodeURIComponent(id)}/toggle-publish`).then(unbox);


export default api;

// src/api.js
import axios from "axios";

/** Base URL (strip trailing slash) */
const RAW = import.meta.env?.VITE_API_BASE_URL || "http://localhost:4000";
export const API_BASE = RAW.replace(/\/$/, "");

export const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

/* -------------------- STUDENTS -------------------- */
export const signUpStudent = (payload) => api.post("/api/Student", payload);
// NOTE: backend route uses 'loging'
export const loginStudent = (payload) => api.post("/api/Student/login", payload);


/* -------------------- STAFF -------------------- */
export const registerStaff = (payload) => api.post("/api/Staff/register", payload);
export const loginStaff = (payload) => api.post("/api/Staff/loging", payload);
export const getAllStaff = () => api.get("/api/Staff/viewStaffmember");
export const getStaffById = (staffId) => api.get(`/api/Staff/viewStaffmember/${encodeURIComponent(staffId)}`);
export const updateStaffById = (staffId, payload) => api.put(`/api/Staff/updateStaffmember/${encodeURIComponent(staffId)}`, payload);
export const deleteStaffById = (staffId) => api.delete(`/api/Staff/deleteStaffmember/${encodeURIComponent(staffId)}`);

/* -------------------- ADMIN & TEACHER (add if your backend exposes these) -------------------- */
// keep same 'loging' pattern for consistency with your codebase
export const adminLoging = (payload) => api.post("/api/Admin/login", payload);
export const loginTeacher = (payload) => api.post("/api/Teacher/login", payload);

/* Generic role helper */
export async function loginByRole(role, creds) {
  const r = role?.toLowerCase();
  if (r === "student") {
    const { data } = await loginStudent(creds);
    return { token: data?.token, user: { role: "student", ...(data?.student || data?.user || {}) } };
  }
  if (r === "staff") {
    const { data } = await loginStaff(creds);
    return { token: data?.token, user: { role: "staff", ...(data?.staff || data?.user || {}) } };
  }
  if (r === "admin") {
    const { data } = await adminLoging(creds);
    return { token: data?.token, user: { role: "admin", ...(data?.admin || data?.user || {}) } };
  }
  if (r === "teacher") {
    const { data } = await loginTeacher(creds);
    return { token: data?.token, user: { role: "teacher", ...(data?.teacher || data?.user || {}) } };
  }
  throw new Error("Unknown role");
}

export default api;

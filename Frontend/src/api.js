// src/api.js
import axios from "axios";

/** Base URL (strip trailing slash) */
const RAW = import.meta.env?.VITE_API_BASE_URL || "http://localhost:5000";
export const API_BASE = RAW.replace(/\/$/, "");

/** Single axios client
 * NOTE: Staff update/delete need admin session, so cookies must be sent.
 * If you 100% don't use sessions, set withCredentials:false – but your backend
 * enables sessions when deps exist, so we keep it true for safety.
 */
export const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});
// ===>>> මෙතනට පහත කොටස අලුතින් එක් කරන්න <<<===
// API request එක යැවීමට පෙර මෙම කේතය ක්‍රියාත්මක වේ
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('itguru_token'); // localStorage එකෙන් token එක ලබාගනී
    if (token) {
      // token එක ඇත්නම්, එය Authorization header එකට එක් කරයි
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
// ===>>> වෙනස්කම මෙතැනින් අවසන් <<<===

/* -------------------- STUDENTS -------------------- */
/** These match your typical Student routes used elsewhere:
 *  - POST /api/Student/register
 *  - POST /api/Student/loging  (note: backend uses 'loging' spelling)
 */
export const signUpStudent = (payload) =>
  api.post("/api/student/register", payload);
export const loginStudent = (payload) =>
  api.post("/api/student/login", payload);


export const registerStaff = (payload) =>
  api.post("/api/Staff/register", payload);
export const loginStaff = (payload) =>
  api.post("/api/Staff/loging", payload);
export const getAllStaff = () =>
  api.get("/api/Staff/viewStaffmember");
export const getStaffById = (staffId) =>
  api.get(`/api/Staff/viewStaffmember/${encodeURIComponent(staffId)}`);
export const updateStaffById = (staffId, payload) =>
  api.put(`/api/Staff/updateStaffmember/${encodeURIComponent(staffId)}`, payload);
export const deleteStaffById = (staffId) =>
  api.delete(`/api/Staff/deleteStaffmember/${encodeURIComponent(staffId)}`);

/* Optional: generic helper if you need raw access */
export default api;

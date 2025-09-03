// src/api.js
import axios from "axios";

// point to your API (NOT the Vite dev server)
const RAW = import.meta.env?.VITE_API_BASE_URL || "http://localhost:3000";
export const API_BASE = RAW.replace(/\/$/, "");

export const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
  withCredentials: false, // set true only if you actually use cookies
});

// -------- Students --------
export const signUpStudent = (payload) => api.post("/api/student", payload);
export const loginStudent  = (payload) => api.post("/api/student/login", payload);

// -------- Staff --------
export const createStaff  = (payload) => api.post("/api/staff", payload);   // <— PLURAL
export const loginStaff   = (payload) => api.post("/api/staff/login", payload);

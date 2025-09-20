// src/ProtectedRoute.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getAuth, hasRole } from "./auth";

export default function ProtectedRoute({ allow }) {
  const { token } = getAuth();
  if (!token) return <Navigate to="/admin" replace />; // your login page path
  if (allow && !hasRole(allow)) return <Navigate to="/admin" replace />;
  return <Outlet />;
}

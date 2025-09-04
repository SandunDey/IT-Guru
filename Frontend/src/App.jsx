// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import PaymentsPage from "./Payment.jsx";
import LoginPage from "./LoginPage.jsx";
import AdminLoginPage from "./loging.jsx"; // keep this if your file name is 'loging.jsx'
import Checkout from "./button.jsx";
import StudentSignUpPage from "./StudentSignUpPage.jsx";
import StaffPage from "./StaffPage.jsx";

// ✅ Add Staff page if you created it at src/pages/StaffPage.jsx


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default: go to /login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Auth + entry */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminLoginPage />} />
        <Route path="/signup" element={<StudentSignUpPage />} />

        {/* Payments / demo */}
        <Route path="/payment" element={<PaymentsPage />} />
        <Route path="/button" element={<Checkout />} />

        {/* Staff CRUD (matches backend /api/Staff routes) */}
        <Route path="/staff" element={<StaffPage />} />

        {/* 404 */}
        <Route path="*" element={<div className="p-6">Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}

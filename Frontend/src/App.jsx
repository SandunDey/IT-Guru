// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import PaymentsPage from "./Payment.jsx";
import LoginPage from "./LoginPage.jsx";
import AdminLoginPage from "./loging.jsx"; // if file is "loging.jsx" keep this import
import Checkout from "./button.jsx";
import StaffDashboard from "./StaffDashboard.jsx";
import StudentSignUpPage from "./StudentSignUpPage.jsx";



// ❌ REMOVE importing backend model into frontend (breaks bundling)
// import Staff from "../../Backend/model/Staff.js";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminLoginPage />} />
        <Route path="/signup" element={<StudentSignUpPage />} />
        <Route path="/payment" element={<PaymentsPage />} />
        <Route path="/button" element={<Checkout />} />
        <Route path="/admindashboard" element={<StaffDashboard />} />
        <Route path="/admindashbord" element={<Navigate to="/admindashboard" replace />} />

     

        <Route path="*" element={<div className="p-6">Not Found</div>} />

        {/* ❌ remove broken route */}
        {/* <Route path="/staff" element={<Staff />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

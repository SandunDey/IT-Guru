// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import PaymentsPage from "./Payment.jsx";
import LoginPage from "./LoginPage.jsx";
import SignupForm from "./StudentSignUpPage.jsx";

import AdminPage from "./pages/adminPage.jsx";
import AboutUs from "./pages/aboutUs.jsx";
import UserAnnouncementPage from "./pages/announcementPage.jsx";
import HomePage from "./pages/homePage.jsx";
import AnnouncementReport from "./pages/announcementReport.jsx";

import HelpCenterPage from "./HelpCenterPage.jsx";
import SubmitTicketPage from "./SubmitTicketPage.jsx";
import MyTicketsPage from "./MyTicketsPage.jsx";
import TicketDetailPage from "./TicketDetailPage.jsx";
import StaffPage from "./StaffPage.jsx";
import AdminLoginPage from "./loging.jsx";
import StudentDashboard from "./pages/Studentdashbord.jsx";
import StudentProfile from "./pages/StudentProfile.jsx";

import ProtectedRoute from "./ProtectedRoute.jsx";

function TeacherDashboard() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Teacher Dashboard</h1>
      <p className="text-slate-600 mt-2">Welcome, Teacher.</p>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        {/* Public */}
        <Route path="/" element={<HomePage />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/payment" element={<PaymentsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/announcement" element={<UserAnnouncementPage />} />
        <Route path="/announcement/report" element={<AnnouncementReport />} />
        <Route path="/support" element={<HelpCenterPage />} />
        <Route path="/submit-ticket" element={<SubmitTicketPage />} />
        <Route path="/my-tickets" element={<MyTicketsPage />} />
        <Route path="/tickets/:ticketId" element={<TicketDetailPage />} />
        <Route path="/admin" element={<AdminLoginPage />} />

        {/* Protected by role */}
     <Route element={<ProtectedRoute allow="student" />}>
  <Route path="/StudentDashboard" element={<StudentDashboard />} />
  <Route path="/student/profile" element={<StudentProfile />} />
</Route>

        <Route element={<ProtectedRoute allow="staff" />}>
          <Route path="/staff" element={<StaffPage />} />
        </Route>

        <Route element={<ProtectedRoute allow="teacher" />}>
          <Route path="/teacher" element={<TeacherDashboard />} />
        </Route>

        <Route element={<ProtectedRoute allow="admin" />}>
          <Route path="/admin/dashboard/*" element={<AdminPage />} />
        </Route>

        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// pages/StudentQuizPage.jsx
import { useParams } from "react-router-dom";

import PaymentsPage from "./Payment.jsx";
import LoginPage from "./LoginPage.jsx";
import SignupForm from "./StudentSignUpPage.jsx";

import AdminPage from "./pages/adminPage.jsx";
import AboutUs from "./pages/aboutUs.jsx";
import UserAnnouncementPage from "./pages/announcementPage.jsx";
import HomePage from "./pages/homePage.jsx";
import AnnouncementReport from "./pages/announcementReport.jsx";

import HelpCenterPage from "./HelpCenterPage.jsx";
import StaffPage from "./StaffPage.jsx";
import AdminLoginPage from "./loging.jsx";
import StudentDashboard from "./pages/Studentdashbord.jsx";
import StudentProfile from "./pages/StudentProfile.jsx";
import TeacherDashboard from "./pages/TeacherDashboard.jsx";
import QuizPlayer from "./components/QuizPlayer.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import UserVideos from "./pages/UserVideos.jsx";

import MyTicketsPage from './components/MyTicketsPage.jsx';
import SubmitTicketPage from './components/SubmitTicketPage.jsx';
import TicketDetailPage from './components/TicketDetailPage.jsx';
import AdminTicketsPage from './pages/AdminTicketsPage.jsx';
import FeedbackPage from './pages/FeedbackPage.jsx';
import TempAdminDashboard from './pages/TempAdminDashboard.jsx';
import TempFeedbackDashboard from './pages/TempFeedbackDashboard.jsx';


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
        <Route path="/Uservideos" element={<UserVideos />} />
        <Route path="/feedback" element={<FeedbackPage />} />
        <Route path="/temp-admin-tickets" element={<TempAdminDashboard />} />
        <Route path="/temp-admin-feedback" element={<TempFeedbackDashboard />} />
        
        


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
          <Route path="/admin/tickets" element={<AdminTicketsPage />} /> {/*vishwa */}
        </Route>

         {/* Teacher area */}
          <Route path="/teacher/dashboard" element={<TeacherDashboard />} />

          {/* Student quiz play */}
          <Route path="/quiz/:id" element={<StudentQuizPage />} />

        <Route path="/StudentDashboard/quiz/:quizId" element={<StudentQuizPage />} />
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
}
function StudentQuizPage() {
  const { id } = useParams();
  // plug in your real student id after auth:
  const studentId = localStorage.getItem("studentId") || "student-demo-001";
  return (
    <div className="min-h-screen bg-blue-50 p-4">
      <QuizPlayer quizId={id} studentId={studentId} />
    </div>
  );
}
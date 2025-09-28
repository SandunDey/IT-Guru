// src/App.jsx
import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// ---- Splash (start UI) ----
import Splash from "./components/Splash.jsx";

// ---- Pages & components (as you had) ----
import { useParams } from "react-router-dom";
import PaymentsPage from "./Payment.jsx";
import SignupForm from "./StudentSignUpPage.jsx";
import AdminPage from "./pages/adminPage.jsx";
import AboutUs from "./pages/aboutUs.jsx";
import UserAnnouncementPage from "./pages/announcementPage.jsx";
import HomePage from "./pages/homePage.jsx";
import AnnouncementReport from "./pages/announcementReport.jsx";
import HelpCenterPage from "./HelpCenterPage.jsx";

import StaffPage from "./StaffPage.jsx";
import LoginPage from "./loging.jsx";
import StudentDashboard from "./pages/Studentdashbord.jsx";
import StudentProfile from "./pages/StudentProfile.jsx";
import TeacherDashboard from "./pages/TeacherDashboard.jsx";
import QuizPlayer from "./components/QuizPlayer.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import UserVideos from "./pages/UserVideos.jsx";
import ClassCardList from "./pages/client/classCardView.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import ClassCards from "./pages/Classtype.jsx";
import PaymentSuccess from "./pages/PaymentSuccess.jsx"
import ClassView from "./pages/ClassView.jsx";
import Class from "./pages/ClassCards";
import UserEnrollmentPage from "./pages/enrollmentPage.jsx";
import AdminEnrollmentPage from "./pages/admin/adminEnrollmentPage.jsx";
import UpdateTimetablePage from "./pages/admin/UpdateTimetablePage.jsx";
import StudentTimetable from "./pages/StudentTimetable.jsx";
import TimetableList from "./pages/admin/TimetableList.jsx";
import CreateTimetableForm from "./pages/admin/createTimetable.jsx";
import TestMarks from "./pages/TestMarks.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import ContactUs from "./ContactUs.jsx"
import MyTicketsPage from './components/MyTicketsPage.jsx';
import SubmitTicketPage from './components/SubmitTicketPage.jsx';
import TicketDetailPage from './components/TicketDetailPage.jsx';
import AdminTicketsPage from './pages/AdminTicketsPage.jsx';
import FeedbackPage from './pages/FeedbackPage.jsx';
import TempAdminDashboard from './pages/TempAdminDashboard.jsx';
import TempFeedbackDashboard from './pages/TempFeedbackDashboard.jsx';
import FloatingButtons from "./components/FloatingButtons";



export default function App() {
  const [ready, setReady] = useState(false);

  if (!ready) {
    // Show the start UI (blue fade + animated loader)
    return <Splash onDone={() => setReady(true)} minDelay={1800} />;
  }

  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        {/* Public */}
        <Route path="/" element={<HomePage />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/payment" element={<PaymentsPage />} />
        {/* <Route path="/login" element={<LoginPage />} /> */}
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/announcement" element={<UserAnnouncementPage />} />
        <Route path="/announcement/report" element={<AnnouncementReport />} />
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="/contactus" element={<ContactUs />} />
   
        <Route path="/admin" element={<LoginPage />} />
        <Route path="/Uservideos" element={<UserVideos />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/classtype" element={<ClassCards/>}/>
        <Route path="/paymentSuccess" element={<PaymentSuccess />} />
         <Route path="/enrollment" element={<UserEnrollmentPage />} />
         <Route path="/admin/dashboard/enrollment" element={<AdminEnrollmentPage />} />
          <Route path="/test-marks" element={<TestMarks />} />
          <Route path="/feedback" element={<FeedbackPage />} />
        <Route path="/temp-admin-tickets" element={<TempAdminDashboard />} />
        <Route path="/temp-admin-feedback" element={<TempFeedbackDashboard />} />
           <Route path="/support" element={<HelpCenterPage />} />
        <Route path="/submit-ticket" element={<SubmitTicketPage />} />
        <Route path="/my-tickets" element={<MyTicketsPage />} />
        <Route path="/tickets/:ticketId" element={<TicketDetailPage />} />
       <Route path="/admin/tickets" element={<AdminTicketsPage />} />

        {/* Protected by role */}
        <Route element={<ProtectedRoute allow="student" />}>
          <Route path="/StudentDashboard" element={<StudentDashboard />} />
          <Route path="/student/profile" element={<StudentProfile />} />
        </Route>

        <Route element={<ProtectedRoute allow="staff" />}>
          <Route path="/staff" element={<StaffPage />} />
        </Route>

        <Route path="/" element={<Class />} />
        <Route path="/class/:batchName" element={<ClassView />} />
    
          <Route path="/teacher" element={<TeacherDashboard />} />

          <Route path="/admin/dashboard/*" element={<AdminPage />} />
        
         <Route path="/class/:id" element={<ClassView />} />
        {/* Teacher area (unprotected shortcut, keep if you really need both) */}
        {/* <Route path="/teacher/dashboard" element={<TeacherDashboard />} /> */}

        {/* Student quiz play */}
        <Route path="/quiz/:id" element={<StudentQuizPage />} />
        <Route path="/classcard" element={<ClassCardList />} />
        {/* 404 */}
        <Route path="*" element={<h1>404 Not Found</h1>} />
         <Route path="/admin/dashboard/timetable/update/:timetableId" element={<UpdateTimetablePage />} />
        <Route path="/timetable/list" element={<TimetableList/>}/>
        <Route path ="/student/viewTimetable" element={<StudentTimetable/>}/>
        <Route path="/admin/dashboard/timetable/create" element={<CreateTimetableForm/>}/>

      </Routes>
      {/* ✅ Floating Buttons appear on every page */}
      <FloatingButtons
        onSupportClick={() => (window.location.href = "/support")}
        onFeedbackClick={() => (window.location.href = "/feedback")}
      />
    </BrowserRouter>

  ); 
}

/* ---------- Inline page for quiz player as you had ---------- */
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

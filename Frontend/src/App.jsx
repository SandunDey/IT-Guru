// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route , Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import SubmitTicketPage from "./SubmitTicketPage.jsx";
import MyTicketsPage from "./MyTicketsPage.jsx";
import TicketDetailPage from "./TicketDetailPage.jsx";

// ===>>> මෙම PrivateRoute component එක අලුතින් එක් කරන්න <<<===
const PrivateRoute = ({ children }) => {
  // localStorage සහ sessionStorage යන දෙකෙන්ම 'itguru_token' එක සොයන්න
  const token = localStorage.getItem("itguru_token") || sessionStorage.getItem("itguru_token");
  
  // token එකක් ඇත්නම්, ඉල්ලූ පිටුව පෙන්වන්න. නැත්නම්, '/login' පිටුවට යොමු කරන්න.
  return token ? children : <Navigate to="/login" />;
};

import PaymentsPage from "./Payment.jsx";
import LoginPage from "./LoginPage.jsx";
import SignupForm from "./StudentSignUpPage.jsx";

import AdminPage from "./pages/adminPage.jsx";
import AboutUs from "./pages/aboutUs.jsx"; // ✅ fixed path
import UserAnnouncementPage from "./pages/announcementPage.jsx";
import HomePage from "./pages/homePage.jsx";
import AnnouncementReport from "./pages/announcementReport.jsx";

import HelpCenterPage from "./HelpCenterPage.jsx";
//import SubmitTicketPage from "./SubmitTicketPage.jsx";
//import MyTicketsPage from "./MyTicketsPage.jsx";
//import TicketDetailPage from "./TicketDetailPage.jsx";
import StaffPage from "./StaffPage.jsx";
import AdminLoginPage from "./loging.jsx";

import FeedbackPage from './components/FeedbackPage';
import UserEnrollmentPage from "./pages/enrollmentPage.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/payment" element={<PaymentsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/announcement" element={<UserAnnouncementPage />} />
        <Route path="/announcement/report" element={<AnnouncementReport />} />
        <Route path="/enrollment" element={<UserEnrollmentPage />} />
        <Route path="/enrollment/report" element={<h1>Report</h1>} />
        <Route path="/support" element={<HelpCenterPage />} />
        <Route path="/admin" element={<AdminLoginPage />} />
        <Route path="/staff" element={<StaffPage />} />
        <Route path="/admin/dashboard/*" element={<AdminPage />} />
        <Route path="/feedback" element={<FeedbackPage />} />
        <Route path="*" element={<h1>404 Not Found</h1>} />
        <Route
          path="/submit-ticket"
          element={
            <PrivateRoute>
              <SubmitTicketPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/my-tickets"
          element={
            <PrivateRoute>
              <MyTicketsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/tickets/:ticketId"
          element={
            <PrivateRoute>
              <TicketDetailPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

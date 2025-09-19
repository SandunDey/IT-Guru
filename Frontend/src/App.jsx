import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import PaymentsPage from "./Payment.jsx";
import LoginPage from "./LoginPage.jsx";

import AdminPage from "./pages/adminPage.jsx";
import AboutUs from "./pages/aboutUs.jsx";
import UserAnnouncementPage from "./pages/announcementPage.jsx";
import HomePage from "./pages/homePage.jsx";
import AnnouncementReport from "./pages/announcementReport.jsx";
import { Toaster } from "react-hot-toast";

import AdminLoginPage from "./loging.jsx";
//supportTicket(Vishwa)
import HelpCenterPage from "./HelpCenterPage.jsx";
import SubmitTicketPage from "./SubmitTicketPage.jsx";
import MyTicketsPage from "./MyTicketsPage.jsx";
import TicketDetailPage from "./TicketDetailPage.jsx";
import Enrollment from "./pages/enrollmentPage.jsx";


export default function App() {
  return (
    <BrowserRouter>
      <div className="w-full h-[100vh]">
        <Toaster position="top-right" />

        <Routes>
          {/*install karagatta router-dom ekem ganne meka component ekak */}
          {/*  me vage Route gdk dagann puluvam */}
          <Route path="/payment" element={<PaymentsPage />} />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin/dashboard/*" element={<AdminPage />} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/announcement" element={<UserAnnouncementPage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/support" element={<HelpCenterPage />} />
          <Route path="/submit-ticket" element={<SubmitTicketPage />} />
          <Route path="/my-tickets" element={<MyTicketsPage />} />
          <Route path="/tickets/:ticketId" element={<TicketDetailPage />} />
          <Route path="/admin" element={<AdminLoginPage />} />
          <Route path="/enrollment" element={<Enrollment/>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

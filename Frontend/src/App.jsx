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

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/payment" element={<PaymentsPage/>}/>
        <Route path="/" element={<LoginPage/>}/>
        <Route path="/admin" element={<AdminLoginPage/>}/>
      </Routes>
    </BrowserRouter>
  );
}

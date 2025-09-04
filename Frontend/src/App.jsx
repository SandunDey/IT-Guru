import { useState } from 'react'
import { BrowserRouter, Route,Routes } from 'react-router-dom'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import PaymentsPage from './Payment.jsx';
import LoginPage from './LoginPage.jsx'
import AdminPage from './pages/adminPage.jsx'
import AboutUs from './pages/aboutUs.jsx'
import UserAnnouncementPage from './pages/announcementPage.jsx'
import HomePage from './pages/homePage.jsx'
import AnnouncementReport from './pages/announcementReport.jsx'
import { Toaster } from 'react-hot-toast'

export default function App() {
  return(
    <BrowserRouter>
    <div className="w-full h-[100vh]">

        <Toaster position="top-right" />

      <Routes >
      {/*install karagatta router-dom ekem ganne meka component ekak */}
          {/*  me vage Route gdk dagann puluvam */}
        <Route path="/payment" element={<PaymentsPage/>}/>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/admin/*" element={<AdminPage />} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/announcement" element={<UserAnnouncementPage />} />
          <Route path="/" element={<HomePage />} />
           <Route
            path="/admin/announcement-report"
            element={<AnnouncementReport />}
          />
      </Routes>
      </div>
    </BrowserRouter>

  )

}



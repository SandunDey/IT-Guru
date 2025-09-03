import { useState } from 'react'
import { BrowserRouter, Route,Routes } from 'react-router-dom'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import PaymentsPage from './Payment.jsx';
import LoginPage from './LoginPage.jsx'
import AdminLoginPage from './loging.jsx'
import StudentSignUpPage from "./StudentSignUpPage.jsx";
import Checkout from './button.jsx'
import StaffDashboard from './StaffDashboard.jsx'




export default function App() {
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/payment" element={<PaymentsPage/>}/>
        <Route path="/" element={<LoginPage/>}/>
        <Route path="/admin" element={<AdminLoginPage/>}/>
        <Route path="/signup" element={<StudentSignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/button" element={<Checkout/>}/>
         <Route path="/admindashbord" element={<StaffDashboard/>} />
        
      </Routes>
    </BrowserRouter>

  )

}


function LoginPagePlaceholder() {
  return (
    <div style={{ padding: 24 }}>
      <h1>Login Page</h1>
      <p>Replace this with your real login page component.</p>
    </div>
  );
}




import { useState } from 'react'
import { BrowserRouter, Route,Routes } from 'react-router-dom'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import PaymentsPage from './Payment.jsx';
import LoginPage from './LoginPage.jsx'

export default function App() {
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/payment" element={<PaymentsPage/>}/>
        <Route path="/" element={<LoginPage/>}/>
      </Routes>
    </BrowserRouter>

  )

}



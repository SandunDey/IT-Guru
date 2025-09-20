
import AboutUs from "./aboutUs";
import React from "react";
import Header from "../components/header";
import HeroSection from "../components/HeroSection";
import FeaturesSection from "../components/FeaturesSection";
import SubjectsSection from "../components/SubjectsSection";
import HowItWorks from "../components/HowItWorks";
import TestimonialsSection from "../components/TestimonialsSection";
import TutorSection from "../components/TutorSection";
import PricingSection from "../components/PricingSection";
import FaqSection from "../components/FaqSection";
import ContactSection from "../components/ContactSection";
import Footer from "../components/footer";
import { Route, Routes } from "react-router-dom";


export default function HomePage() {
  return (
    <div className="w-full h-full bg-primary">
      <Header/>
      <HeroSection />
      <FeaturesSection />
      <SubjectsSection />
      <HowItWorks />
      <TestimonialsSection />
      <TutorSection />
      <PricingSection />
      <FaqSection />
      <ContactSection />
      
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route
          path="/enrollment/learning-material"
          element={<h1>Material</h1>}
        />
        <Route path="/performance" element={<h1>Performance</h1>} />
        <Route path="/timetable" element={<h1>Time Table</h1>} />
        <Route path="/quizzes" element={<h1>Quizzes</h1>} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/enrollment" element={<Enrollment />} />
        <Route path="/*" element={<h1>404 Not Found</h1>} />
        </Routes>
      <Footer/>
    </div>
  );
}

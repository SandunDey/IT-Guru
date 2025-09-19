import { Route, Routes } from "react-router-dom";
import Header from "../components/header";
import AboutUs from "./aboutUs";
import Enrollment from "./enrollmentPage";

export default function HomePage() {
  return (
    <div className="w-full h-full bg-primary">
      <Header />
      <Routes path="/">
        <Route path="/" element={<h1>Welcome to the Home Page</h1>} />
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
    </div>
  );
}

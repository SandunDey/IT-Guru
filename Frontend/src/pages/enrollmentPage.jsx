import { useEffect, useState } from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

// ✅ Add API base URL
const RAW_BASE =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_BASE_URL) ||
  (typeof process !== "undefined" && process.env?.REACT_APP_API_BASE_URL) ||
  "http://localhost:4000"; // fallback if env not set
const API_BASE = RAW_BASE.replace(/\/$/, "");

export default function UserEnrollmentPage() {
  const [student, setStudent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedYear, setSelectedYear] = useState("");
  const [enrollmentKey, setEnrollmentKey] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const savedStudent = JSON.parse(localStorage.getItem("student"));
    if (savedStudent) {
      setStudent(savedStudent);
    }
  }, []);

  function handleEnrollClick(year) {
    if (!student) {
      toast.error("Please login first!");
      return;
    }

    if (parseInt(student.year) !== year) {
      toast.error(`You can only enroll for your year (${student.year} A/L).`);
      return;
    }

    setSelectedYear(year + " A/L");
    setEnrollmentKey("");
    setShowModal(true);
  }

  async function handleSubmit() {
    if (!enrollmentKey) {
      toast.error("Please enter your enrollment key!");
      return;
    }

    try {
      const key = enrollmentKey.trim().toUpperCase();

      // 1️⃣ Verify student exists
      const res = await fetch(`${API_BASE}/api/student/verify/${key}`);
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Enrollment key is invalid");
      }
      const verifiedStudent = await res.json();

      // 2️⃣ Create a new enrollment
      const enrollmentRes = await fetch(`${API_BASE}/api/enrollments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentID: verifiedStudent.studentId,
          classYear: selectedYear,
          enrollmentKey: key,
        }),
      });

      const enrollmentData = await enrollmentRes.json();
      if (!enrollmentRes.ok) throw new Error(enrollmentData.message);

      toast.success(
        `Enrolled successfully for ${selectedYear} with key: ${enrollmentKey}`
      );
      setShowModal(false);
      setEnrollmentKey("");

      navigate(`/learning-materials/${student.studentId}`);
    } catch (err) {
      toast.error(err.message);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100 flex flex-col">
      <Header />

      {/* Main Section */}
      <main className="flex-grow flex flex-col items-center justify-center px-6 pt-28 pb-16">
        <div className="text-center space-y-10 max-w-2xl mt-15">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
            Enroll for Your A/L Classes
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            Select your exam year below and start your learning journey with us.
          </p>

          <div className="flex flex-wrap justify-center gap-8 mt-15">
            {[2025, 2026, 2027].map((year) => (
              <button
                key={year}
                onClick={() => handleEnrollClick(year)}
                className={`px-12 py-5 rounded-2xl text-white text-lg font-semibold shadow-lg transform transition duration-300 ${
                  year === 2025
                    ? "bg-gradient-to-r from-indigo-500 to-blue-600 hover:scale-110"
                    : year === 2026
                    ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:scale-110"
                    : "bg-gradient-to-r from-pink-500 to-rose-600 hover:scale-110"
                }`}
              >
                {year}
              </button>
            ))}
          </div>
        </div>
      </main>

      <Footer />

      {/* Enrollment Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-[90%] max-w-md text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Enroll in {selectedYear}
            </h2>
            <p className="text-gray-600 mb-6">
              Please enter your enrollment key to proceed.
            </p>

            <input
              type="text"
              value={enrollmentKey}
              onChange={(e) => setEnrollmentKey(e.target.value)}
              placeholder="Enter enrollment key"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none mb-6"
            />

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-3 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md transition"
              >
                Enroll
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

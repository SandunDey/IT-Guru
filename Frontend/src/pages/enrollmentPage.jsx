import { useState } from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";

export default function UserEnrollmentPage() {
  const { studentId } = useParams(); // get from route, e.g., /enroll/STU123
  const [student, setStudent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedYear, setSelectedYear] = useState("");
  const [enrollmentKey, setEnrollmentKey] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    /** meka tikak balanna */
    async function fetchStudent() {
      try {
        const res = await fetch(`/api/students/${studentId}`);
        if (!res.ok) throw new Error("Failed to fetch student data");
        const data = await res.json();
        setStudent(data);
      } catch (err) {
        toast.error(err.message);
      }
    }
    fetchStudent();
  }, [studentId]);

  function handleEnrollClick(year) {
    if (!student) return;
    if (student.year !== parseInt(year)) {
      toast.error(
        "You cannot enroll for a year different from your student year."
      );
      return;
    }
    setSelectedYear(year + " A/L");
    setEnrollmentKey("");
    setShowModal(true);
  }

  function handleSubmit() {
    if (!student) return;

    if (!enrollmentKey) {
      toast.error("Please enter your enrollment key!");
      return;
    }

    if (enrollmentKey !== student.studentId) {
      toast.error("Enrollment key is incorrect!");
      return;
    }

    toast.success(
      `Enrolled successfully for ${selectedYear} with key: ${enrollmentKey}`
    );
    setShowModal(false);
    setEnrollmentKey("");

    navigate(`/learning-materials/${student.studentId}`);
  }

  //  if (!student) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center">
  //       <p className="text-gray-600">Loading student data...</p>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100 flex flex-col">
      <Header />

      {/* Main Section */}
      <main className="flex-grow flex flex-col items-center justify-center px-6 pt-28 pb-16">
        <div className="text-center space-y-10 max-w-2xl mt-15">
          {/* Heading */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
            Enroll for Your A/L Classes
          </h1>

          {/* Description */}
          <p className="text-lg text-gray-600 leading-relaxed">
            Select your exam year below and start your learning journey with us.
            Our expert teachers and study plans will guide you step by step
            toward success.
          </p>

          {/* Buttons */}
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

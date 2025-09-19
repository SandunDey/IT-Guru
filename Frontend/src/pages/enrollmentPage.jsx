import { useState } from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import toast from "react-hot-toast";

export default function AboutUs() {
  const [showModal, setShowModal] = useState(false);
  const [selectedYear, setSelectedYear] = useState("");
  const [enrollmentKey, setEnrollmentKey] = useState("");

  function handleEnrollClick(year) {
    setSelectedYear(year);
    setShowModal(true);
  }

  function handleSubmit() {
    if (!enrollmentKey) {
      toast.error("Please enter your enrollment key!");
      return;
    }
    toast.success(
      `Enrolled successfully for ${selectedYear} with key: ${enrollmentKey}`
    );
    setShowModal(false);
    setEnrollmentKey("");
  }

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
            <button
              onClick={function () {
                handleEnrollClick("2025 A/L");
              }}
              className="px-12 py-5 rounded-2xl bg-gradient-to-r from-indigo-500 to-blue-600 text-white text-lg font-semibold shadow-lg hover:scale-110 hover:shadow-indigo-400/50 transform transition duration-300"
            >
              2025 A/L
            </button>
            <button
              onClick={function () {
                handleEnrollClick("2026 A/L");
              }}
              className="px-12 py-5 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 text-white text-lg font-semibold shadow-lg hover:scale-110 hover:shadow-green-400/50 transform transition duration-300"
            >
              2026 A/L
            </button>
            <button
              onClick={function () {
                handleEnrollClick("2027 A/L");
              }}
              className="px-12 py-5 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-600 text-white text-lg font-semibold shadow-lg hover:scale-110 hover:shadow-pink-400/50 transform transition duration-300"
            >
              2027 A/L
            </button>
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
              onChange={function (e) {
                setEnrollmentKey(e.target.value);
              }}
              placeholder="Enter enrollment key"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none mb-6"
            />

            <div className="flex justify-center gap-4">
              <button
                onClick={function () {
                  setShowModal(false);
                }}
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

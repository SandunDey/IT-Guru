import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

export default function UpdateEnrollmentPage() {
  const location = useLocation(); //update ekt enkot data tikath navigate vunad kiyala balann use karan hook ek

  const [enrollmentID, setEnrollmentID] = useState(location.state.enrollmentID);
  const [studentId, setStudentId] = useState(location.state.studentId);
  const [name, setName] = useState(location.state.name);
  const [year, setYear] = useState(location.state.year);
  const [paymentStatus, setPaymentStatus] = useState(
    location.state.paymentStatus
  );
  const [isActive, setIsActive] = useState(location.state.isActive);
  const [enrollmentDate, setEnrollmentDate] = useState(
    location.state.enrollmentDate
  );

  const navigate = useNavigate();

  async function updateEnrollment() {
    const token = localStorage.getItem("token");

    if (token == null) {
      navigate("/login");
      return;
    }

    try {
      //backend ekt yavann ona json ek
      const enrollment = {
        enrollmentID: enrollmentID,
        studentId: studentId,
        name: name,
        year: year,
        paymentStatus: paymentStatus,
        isActive: isActive,
        enrollmentDate: enrollmentDate,
      };

      //backend call
      await axios.put(
        import.meta.env.VITE_API_BASE_URL + "/api/enrollments/" + enrollmentID,
        enrollment,
        {
          //1-> yavann ona url ek , import
          //2-> enrollment
          //3-> token
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      toast.success("Enrollment Updated Successfully");
      navigate("/admin/dashboard/enrollments");
    } catch {
      toast.error("An error Occurred");
    }
  }

  return (
    <div className="w-full min-h-screen flex justify-center items-start bg-gray-50 py-12 px-4">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-gray-200 p-10">
        <h2 className="text-3xl font-semibold text-accent mb-8 border-b pb-3">
          Update Enrollment
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Enrollment ID */}
          {/*input eke value ek vidiyt thiyenna ona variable agaya*/}
          <div>
            <label className="block text-sm font-medium text-shadow-indigo-950 mb-2">
              Enrollment ID
            </label>
            <input
              className="w-full p-3 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm transition"
              disabled
              value={enrollmentID}
              onChange={(e) => setEnrollmentID(e.target.value)}
            />
          </div>

          {/* StudentId */}
          <div>
            <label className="block text-sm font-medium text-shadow-indigo-950 mb-2">
              Student ID
            </label>
            <input
              type="text"
              className="w-full p-3 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm transition"
              placeholder="e.g., STU001"
              disabled
              value={studentId?.studentId || studentId || ""}
              onChange={(e) => setStudentId(e.target.value)}
            />
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-shadow-indigo-950 mb-2">
              Student Name
            </label>
            <input
              type="text"
              className="w-full p-3 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm transition"
              placeholder="e.g., John De Silva"
              value={studentId?.name || name || ""}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Year */}
          <div>
            <label className="block text-sm font-medium text-shadow-indigo-950 mb-2">
              Year
            </label>
            <select
              className="w-full p-3 border rounded-lg border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm transition"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            >
              <option value="2025 A/L">2025 A/L</option>
              <option value="2026 A/L">2026 A/L</option>
              <option value="2027 A/L">2027 A/L</option>
            </select>
          </div>

          {/* Payment Status */}
          <div>
            <label className="block text-sm font-medium text-shadow-indigo-950 mb-2">
              Payment Status
            </label>
            <select
              className="w-full p-3 border rounded-lg border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm transition"
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
            >
              <option value="Paid">Paid</option>
              <option value="Unpaid">Unpaid</option>
            </select>
          </div>

          {/* Active Status */}
          <div>
            <label className="block text-sm font-medium text-shadow-indigo-950 mb-2">
              Active Status
            </label>
            <select
              className="w-full p-3 border rounded-lg border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm transition"
              value={isActive}
              onChange={(e) => setIsActive(e.target.value)}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* Expiry Date */}
          <div>
            <label className="block text-sm font-medium text-shadow-indigo-950 mb-2">
              Enrollment Date
            </label>
            <input
              type="date"
              className="w-full p-3 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm transition"
              value={enrollmentDate}
              onChange={(e) => setEnrollmentDate(e.target.value)}
            />
          </div>
        </div>

        {/* Submit / Cancel button */}
        <div className="mt-8 flex justify-end gap-4">
          <button
            onClick={() => navigate("/admin/dashboard/enrollment")}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg shadow-md transition"
          >
            Cancel Enrollment
          </button>

          <button
            onClick={updateEnrollment}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg shadow-md transition"
          >
            Update Enrollment
          </button>
        </div>
      </div>
    </div>
  );
}

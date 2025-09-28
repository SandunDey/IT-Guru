import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!sessionId) return;
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/payment/session/${sessionId}`
        );
        setDetails(data);
      } catch (err) {
        console.error("Failed to fetch payment details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [sessionId]);

  const downloadReceipt = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/payment/receipt/${sessionId}`,
        { responseType: "blob" }
      );
      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `receipt_${sessionId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed:", err);
      alert("Failed to download receipt");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="w-full max-w-4xl bg-white shadow-xl rounded-xl p-8">
        {/* Header */}
        <div className="flex items-center gap-4 border-b pb-4 mb-6">
          <img
            src="/logo.jpg" // place your ITGuru logo in public/logo.png
            alt="ITGuru"
            className="h-16 w-16 object-contain"
          />
          <div>
            <h1 className="text-2xl font-bold text-blue-800">
              ITGuru Tuition Center
            </h1>
            <p className="text-sm text-gray-600">
              123 Main Street, Colombo, Sri Lanka
            </p>
            <p className="text-sm text-gray-600">
              Phone: +94 77 123 4567 | Email: info@itguru.lk
            </p>
            <p className="text-sm text-gray-600">Web: www.itguru.lk</p>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Timetable Report Summary
        </h2>

        {loading && <p>Loading details...</p>}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200">
            <thead className="bg-blue-900 text-white text-sm">
              <tr>
                <th className="px-4 py-2 text-left">ID</th>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Time</th>
                <th className="px-4 py-2 text-left">Subject</th>
                <th className="px-4 py-2 text-left">Type</th>
                <th className="px-4 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {/* Example static rows (replace with mapped data if needed) */}
              <tr className="border-b">
                <td className="px-4 py-2">TT25924101351</td>
                <td className="px-4 py-2">9/24/2025</td>
                <td className="px-4 py-2">08:00 AM - 10:00 AM</td>
                <td className="px-4 py-2">Basic concept of ICT</td>
                <td className="px-4 py-2">Theory</td>
                <td className="px-4 py-2">Published</td>
              </tr>
              <tr>
                <td className="px-4 py-2">TT25924013630</td>
                <td className="px-4 py-2">9/29/2025</td>
                <td className="px-4 py-2">05:30 AM - 07:00 AM</td>
                <td className="px-4 py-2">Pas</td>
                <td className="px-4 py-2">Revision</td>
                <td className="px-4 py-2">Published</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Actions */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={downloadReceipt}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            Download Receipt (PDF)
          </button>
          <button
            onClick={() => navigate("/class/:id")}
            className="px-4 py-2 rounded-lg border"
          >
            Go to Class
          </button>
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
          >
            Home
          </button>
        </div>
      </div>
    </div>
  );
}

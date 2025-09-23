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
    <div className="min-h-screen flex items-center justify-center bg-green-50 p-6">
      <div className="max-w-2xl w-full bg-white shadow rounded-2xl p-6">
        <h1 className="text-2xl font-bold text-green-700">Payment Successful ✅</h1>
        <p className="text-gray-600 text-sm mb-4">Session ID: {sessionId}</p>

        {loading && <p>Loading details...</p>}
        {details && (
          <div className="overflow-x-auto">
            <table className="min-w-full border text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-3 py-2 text-left">Field</th>
                  <th className="px-3 py-2 text-left">Value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-3 py-2 font-medium">Class</td>
                  <td className="px-3 py-2">{details.payment?.class_name}</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 font-medium">Amount</td>
                  <td className="px-3 py-2">
                    {details.payment?.amount}{" "}
                    {details.session?.currency?.toUpperCase()}
                  </td>
                </tr>
                <tr>
                  <td className="px-3 py-2 font-medium">Status</td>
                  <td className="px-3 py-2">{details.payment?.status}</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 font-medium">Customer</td>
                  <td className="px-3 py-2">
                    {details.session?.customer_details?.email || "—"}
                  </td>
                </tr>
                <tr>
                  <td className="px-3 py-2 font-medium">Date</td>
                  <td className="px-3 py-2">
                    {details.payment?.createdAt
                      ? new Date(details.payment.createdAt).toLocaleString()
                      : "—"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-6 flex gap-3">
          <button
            onClick={downloadReceipt}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            Download Receipt (PDF)
          </button>
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 rounded-lg border"
          >
            Home
          </button>
          <button
  onClick={() => navigate(`/class/${details.payment?.class_name}`)}
  className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
>
  Go to Class
</button>
        </div>
      </div>
    </div>
  );
}

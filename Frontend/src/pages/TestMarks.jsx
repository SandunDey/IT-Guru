// src/pages/TestMarks.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { Trash2 } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FaRegFilePdf } from "react-icons/fa";
import Header from "../components/header";
import Footer from "../components/footer";

const API_BASE = import.meta.env.VITE_API_BASE_URL;
const STUDENT_ID = "66f3e5d7f7a8c9c123456789"; // replace with actual logged-in student id

export default function TestMarks() {
  const [form, setForm] = useState({
    testName: "",
    subject: "",
    marksObtained: "",
    totalMarks: "",
    testDate: "",
  });
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAnalysis();
  }, []);

  async function fetchAnalysis() {
    try {
      const res = await axios.get(
        `${API_BASE}/api/test/testmarks/analysis/${STUDENT_ID}`
      );
      setAnalysis(res.data.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load analysis");
    }
  }

  function validateForm() {
    if (!form.testName || !form.subject) return "All fields are required";
    if (!form.marksObtained || !form.totalMarks) return "Marks are required";
    if (Number(form.marksObtained) > Number(form.totalMarks))
      return "Marks obtained cannot exceed total marks";
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errorMsg = validateForm();
    if (errorMsg) {
      toast.error(errorMsg);
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API_BASE}/api/test/testmarks`, {
        studentId: STUDENT_ID,
        ...form,
      });
      toast.success("Test marks added!");
      setForm({
        testName: "",
        subject: "",
        marksObtained: "",
        totalMarks: "",
        testDate: "",
      });
      fetchAnalysis();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error saving test marks");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    try {
      await axios.delete(`${API_BASE}/api/test/testmarks/${id}`);
      toast.success("Test removed");
      fetchAnalysis();
    } catch (err) {
      toast.error("Failed to delete test");
    }
  }

  function generatePDF() {
    if (!analysis) {
      toast.error("No test data available to generate report!");
      return;
    }

    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;

      // --- Branding Colors ---
      const colors = {
        accent: [18, 65, 112],
        primary: [255, 255, 255],
        secondary: [34, 40, 49],
        border: [28, 110, 164],
        similar: [34, 40, 49],
      };

      // --- Logo ---
      const logoUrl = "/logo.jpg"; // must be in public folder
      doc.addImage(logoUrl, "PNG", 14, 10, 20, 20);

      // --- ITGuru Info ---
      doc.setFontSize(18);
      doc.setTextColor(...colors.accent);
      doc.text("ITGuru Tuition Center", 40, 18);

      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text("123 Main Street, Colombo, Sri Lanka", 40, 25);
      doc.text("Phone: +94 77 123 4567 | Email: info@itguru.lk", 40, 30);
      doc.text("Web: www.itguru.lk", 40, 35);

      // --- Title ---
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text("Student Test Performance Report", 14, 50);

      // --- Summary Section ---
      doc.setFontSize(11);
      doc.text(`Total Tests: ${analysis.overall.totalTests}`, 14, 60);
      doc.text(`Average %: ${analysis.overall.averagePercentage}%`, 14, 66);
      doc.text(`Best Subject: ${analysis.overall.bestSubject}`, 14, 72);
      doc.text(`Worst Subject: ${analysis.overall.worstSubject}`, 14, 78);

      // --- Table Data ---
      const tableData = analysis.recentTests.map((t, idx) => [
        idx + 1,
        t.testName,
        t.subject,
        new Date(t.testDate).toLocaleDateString(),
        t.marksObtained,
        t.totalMarks,
        t.percentage.toFixed(1) + "%",
        t.grade,
      ]);

      autoTable(doc, {
        startY: 90,
        head: [["#", "Test Name", "Subject", "Date", "Marks", "Total", "%", "Grade"]],
        body: tableData,
        theme: "grid",
        headStyles: { fillColor: colors.accent, textColor: 255 },
        styles: { fontSize: 9, cellPadding: 3 },
      });

      // --- Footer ---
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(...colors.similar);

        doc.text(
          "ITGuru Tuition Center - Confidential Report",
          14,
          doc.internal.pageSize.height - 10
        );
        doc.text(
          `Page ${i} of ${pageCount}`,
          pageWidth - 40,
          doc.internal.pageSize.height - 10
        );
      }

      const filename = `ITGuru_TestReport_${new Date()
        .toISOString()
        .split("T")[0]}.pdf`;
      doc.save(filename);

      toast.success("PDF report generated successfully!");
    } catch (error) {
      console.error("PDF creation failed:", error);
      toast.error(`PDF creation failed: ${error.message}`);
    }
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-blue-600 mb-6 mt-25">
            Student Test Performance
          </h1>

          {/* Input Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-white shadow-md rounded-xl p-6 space-y-4 border border-blue-100"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Test Name"
                value={form.testName}
                onChange={(e) => setForm({ ...form, testName: e.target.value })}
                className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
                required
              />
              <input
                type="text"
                placeholder="Subject"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
                required
              />
              <input
                type="number"
                placeholder="Marks Obtained"
                value={form.marksObtained}
                onChange={(e) =>
                  setForm({ ...form, marksObtained: e.target.value })
                }
                className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
                required
              />
              <input
                type="number"
                placeholder="Total Marks"
                value={form.totalMarks}
                onChange={(e) =>
                  setForm({ ...form, totalMarks: e.target.value })
                }
                className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
                required
              />
              <input
                type="date"
                value={form.testDate}
                onChange={(e) => setForm({ ...form, testDate: e.target.value })}
                className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 md:col-span-2"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
            >
              {loading ? "Saving..." : "Add Test Marks"}
            </button>
          </form>

          {/* Analysis Section */}
          {analysis && (
            <div className="mt-10 bg-white shadow-md rounded-xl p-6 border border-blue-100">
              <div className="flex justify-between items-center ">
                <h2 className="text-2xl font-semibold text-blue-600 mb-4">
                  Performance Analysis
                </h2>
                <button
                  onClick={generatePDF}
                  className="flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-400 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
                >
                  <FaRegFilePdf className="text-xl" />
                  Export PDF
                </button>
              </div>

              <p>
                <strong>Total Tests:</strong> {analysis.overall.totalTests}
              </p>
              <p>
                <strong>Average %:</strong> {analysis.overall.averagePercentage}%
              </p>
              <p>
                <strong>Best Subject:</strong> {analysis.overall.bestSubject}
              </p>
              <p>
                <strong>Worst Subject:</strong> {analysis.overall.worstSubject}
              </p>

              {/* Progress Chart */}
              <div className="mt-6 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analysis.progressData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="testName" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="percentage"
                      stroke="#2563eb"
                      strokeWidth={3}
                      dot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Recent Tests */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-2 text-blue-500">
                  Recent Tests
                </h3>
                <ul className="divide-y divide-gray-200">
                  {analysis.recentTests.map((t) => (
                    <li
                      key={t._id}
                      className="py-2 flex justify-between items-center text-gray-700"
                    >
                      <span>
                        {t.testName} ({t.subject}) -{" "}
                        {new Date(t.testDate).toLocaleDateString()}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-blue-600">
                          {t.percentage.toFixed(1)}% ({t.grade})
                        </span>
                        <button
                          onClick={() => handleDelete(t._id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

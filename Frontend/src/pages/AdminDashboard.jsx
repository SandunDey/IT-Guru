import { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import jsPDF from "jspdf";

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

export default function AdminDashboard() {
  const [overview, setOverview] = useState({ admins: 0, students: 0, teachers: 0 });
  const [monthly, setMonthly] = useState(null);

  useEffect(() => {
    axios.get(`${API}/api/stats/overview`).then((res) => setOverview(res.data));
    axios.get(`${API}/api/stats/monthly`).then((res) => setMonthly(res.data));
  }, []);

  const generateReport = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("User Registration Report", 15, 20);
    doc.setFontSize(12);
    doc.text(`Admins: ${overview.admins}`, 15, 40);
    doc.text(`Teachers: ${overview.teachers}`, 15, 50);
    doc.text(`Students: ${overview.students}`, 15, 60);

    if (monthly) {
      let y = 80;
      doc.text("Monthly Registrations:", 15, y);
      y += 10;
      ["admins", "teachers", "students"].forEach((role) => {
        doc.text(`${role.toUpperCase()}:`, 15, y);
        y += 10;
        monthly[role].forEach((m) => {
          doc.text(`${m.month} : ${m.count}`, 25, y);
          y += 8;
        });
        y += 5;
      });
    }

    doc.save("registration-report.pdf");
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-blue-600">📊 Admin Dashboard</h1>

      {/* Overview cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow p-4 text-center">
          <h2 className="text-lg font-semibold">Admins</h2>
          <p className="text-2xl text-blue-600">{overview.admins}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-4 text-center">
          <h2 className="text-lg font-semibold">Teachers</h2>
          <p className="text-2xl text-green-600">{overview.teachers}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-4 text-center">
          <h2 className="text-lg font-semibold">Students</h2>
          <p className="text-2xl text-purple-600">{overview.students}</p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Monthly Registrations</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={mergeMonthlyData(monthly)}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="admins" fill="#3b82f6" />
            <Bar dataKey="teachers" fill="#10b981" />
            <Bar dataKey="students" fill="#8b5cf6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <button
        onClick={generateReport}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        📄 Generate PDF Report
      </button>
    </div>
  );
}

// Helper: merge monthly data
function mergeMonthlyData(monthly) {
  if (!monthly) return [];
  const allMonths = new Set();
  ["admins", "teachers", "students"].forEach((role) => {
    monthly[role]?.forEach((m) => allMonths.add(m.month));
  });

  return Array.from(allMonths)
    .sort()
    .map((month) => ({
      month,
      admins: monthly.admins.find((m) => m.month === month)?.count || 0,
      teachers: monthly.teachers.find((m) => m.month === month)?.count || 0,
      students: monthly.students.find((m) => m.month === month)?.count || 0,
    }));
}

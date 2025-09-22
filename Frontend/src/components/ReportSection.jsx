// src/components/ReportSection.jsx
import React from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "../assets/ITloho.png"; // replace with ITGuru logo

export default function ReportSection() {
  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Logo + Header
    doc.addImage(logo, "PNG", 10, 10, 20, 20);
    doc.setFontSize(16);
    doc.text("ITGuru - Teacher Report", 40, 20);

    // Table (demo data)
    autoTable(doc, {
      startY: 40,
      head: [["Category", "Count"]],
      body: [
        ["Materials", 5],
        ["Quizzes", 3],
        ["Assessments", 2],
      ],
    });

    doc.save("Teacher_Report.pdf");
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Generate Summary Report</h2>
      <button onClick={generatePDF} className="bg-purple-600 text-white px-4 py-2 rounded">
        Generate PDF
      </button>
    </div>
  );
}

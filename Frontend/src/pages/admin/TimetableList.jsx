import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FaFilePdf, FaRegEdit, FaRegFilePdf } from "react-icons/fa";
import { IoTrashOutline, IoClose } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const backendURL = import.meta.env.VITE_API_BASE_URL;

// ✅ Delete Confirmation Modal
function TimetableDeleteConfirm({ timetableID, close, refresh }) {
  async function deleteTimetable() {
    try {
      await axios.delete(
        `${backendURL}/timetable/deleteTimetable/${timetableID}`
      );
      toast.success("Timetable deleted successfully");
      refresh();
      close();
    } catch {
      toast.error("Failed to delete timetable");
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex justify-center items-center px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md relative p-6">
        {/* Close button */}
        <button
          onClick={close}
          className="absolute top-[-42px] right-[-42px] w-[40px] h-[40px] bg-white hover:bg-red-500 rounded-full flex justify-center items-center"
        >
          <IoClose className="text-gray-700 text-lg" />
        </button>

        {/* Warning Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
            <IoTrashOutline className="text-2xl" />
          </div>
        </div>

        <h2 className="text-xl font-semibold text-center mb-2 text-gray-800">
          Delete Timetable
        </h2>

        <p className="text-center text-gray-600 mb-6">
          Are you sure you want to delete timetable{" "}
          <span className="font-bold">{timetableID}</span>? This action cannot
          be undone.
        </p>

        <div className="flex justify-center gap-4">
          <button
            onClick={close}
            className="px-5 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={deleteTimetable}
            className="px-5 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default function TimetableList({ refreshKey }) {
  const [timetables, setTimetables] = useState([]);
  const [isDeleteConfirmVisible, setIsDeleteConfirmVisible] = useState(false);
  const [selectedTimetableID, setSelectedTimetableID] = useState(null);
  const navigate = useNavigate();

  async function fetchTimetables() {
    try {
      const res = await axios.get(`${backendURL}/timetable/allTimetables`);
      if (Array.isArray(res.data)) {
        setTimetables(res.data);
      } else if (Array.isArray(res.data.timetables)) {
        setTimetables(res.data.timetables);
      } else {
        setTimetables([]);
      }
    } catch (err) {
      toast.error("Failed to load timetables");
      setTimetables([]);
    }
  }

  useEffect(() => {
    fetchTimetables();
  }, [refreshKey]);

  // ✅ Styled PDF Export (same logic but UI like AnnouncementReport)
  function generateReport() {
    if (!timetables || timetables.length === 0) {
      toast.error("No timetables to generate report!");
      return;
    }

    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;

      // --- Logo ---
      const logoUrl = "/logo.jpg"; // put logo in public/ folder
      doc.addImage(logoUrl, "PNG", 14, 10, 20, 20);

      // --- ITGuru Info ---
      doc.setFontSize(18);
      doc.setTextColor(18, 65, 112);
      doc.text("ITGuru Tuition Center", 40, 18);

      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text("123 Main Street, Colombo, Sri Lanka", 40, 25);
      doc.text("Phone: +94 77 123 4567 | Email: info@itguru.lk", 40, 30);
      doc.text("Web: www.itguru.lk", 40, 35);

      // --- Title ---
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text("Timetable Report Summary", 14, 50);

      // --- Table Data ---
      const tableData = timetables.map((t, index) => [
        t.timetableID || `TT${index + 1}`,
        t.date ? new Date(t.date).toLocaleDateString() : "N/A",
        `${t.startTime} - ${t.endTime}`,
        t.subject || "N/A",
        t.type || "N/A",
        t.isPublished ? "Published" : "Unpublished",
      ]);

      autoTable(doc, {
        startY: 60,
        head: [["ID", "Date", "Time", "Subject", "Type", "Status"]],
        body: tableData,
        theme: "grid",
        headStyles: { fillColor: [18, 65, 112], textColor: 255 },
        styles: { fontSize: 9, cellPadding: 3 },
      });

      // --- Footer ---
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(34, 40, 49);

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

      // --- Save ---
      const filename = `ITGuru_TimetableReport_${
        new Date().toISOString().split("T")[0]
      }.pdf`;
      doc.save(filename);

      toast.success("PDF report generated successfully!");
    } catch (error) {
      console.error("PDF creation failed:", error);
      toast.error(`PDF creation failed: ${error.message}`);
    }
  }

  return (
    <div className="w-full h-full p-6 bg-primary">
      {/* ✅ Delete Confirm */}
      {isDeleteConfirmVisible && (
        <TimetableDeleteConfirm
          timetableID={selectedTimetableID}
          close={() => setIsDeleteConfirmVisible(false)}
          refresh={fetchTimetables}
        />
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-accent">Timetable Management</h1>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/admin/dashboard/timetable/create")}
            className="flex items-center bg-blue-950 text-white font-semibold px-5 py-2 rounded-lg shadow-md hover:bg-boardercolor transition-colors"
          >
            <FaRegEdit className="text-xl mr-2" /> Add Timetable
          </button>

          {/* ✅ Styled Report Button */}
          <button
            onClick={generateReport}
            disabled={timetables.length === 0}
            className="relative flex items-center gap-3 bg-gradient-to-r from-accent to-boardercolor text-primary px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed"
          >
            <FaRegFilePdf className="text-xl" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl shadow-lg border border-boardercolor">
        {timetables.length === 0 ? (
          <p className="p-4 text-center text-gray-500">No timetables yet.</p>
        ) : (
          <table className="w-full border-collapse">
            <thead className="bg-accent text-white font-bold">
              <tr>
                <th className="py-3 px-4 text-sm">ID</th>
                <th className="py-3 px-4 text-sm">Date</th>
                <th className="py-3 px-4 text-sm">Time</th>
                <th className="py-3 px-4 text-sm">Subject</th>
                <th className="py-3 px-4 text-sm">Type</th>
                <th className="py-3 px-4 text-sm">Status</th>
                <th className="py-3 px-4 text-sm">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-boardercolor bg-white">
              {timetables.map((t) => {
                const dateOnly = t.date
                  ? new Date(t.date).toLocaleDateString()
                  : "";
                return (
                  <tr
                    key={t.timetableID}
                    className="hover:bg-primary transition-colors"
                  >
                    <td className="py-3 px-4 font-semibold text-secondary">
                      {t.timetableID}
                    </td>
                    <td className="py-3 px-4">{dateOnly}</td>
                    <td className="py-3 px-4">
                      {t.startTime} - {t.endTime}
                    </td>
                    <td className="py-3 px-4">{t.subject}</td>
                    <td className="py-3 px-4 capitalize">{t.type}</td>
                    <td className="py-3 px-4">
                      {t.isPublished ? (
                        <span className="px-2 py-1 text-xs font-semibold rounded bg-green-100 text-green-700">
                          Published
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs font-semibold rounded bg-yellow-100 text-yellow-700">
                          Unpublished
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-4 justify-center items-center">
                        <FaRegEdit
                          className="cursor-pointer hover:text-blue-600 hover:scale-110 transition-transform"
                          title="Update"
                          onClick={() =>
                            navigate(
                              `/admin/dashboard/timetable/update/${t.timetableID}`,
                              {
                                state: { timetable: t }, // ✅ pass full timetable object
                              }
                            )
                          }
                        />
                        <IoTrashOutline
                          className="cursor-pointer hover:text-red-500 hover:scale-110 transition-transform"
                          title="Delete"
                          onClick={() => {
                            setSelectedTimetableID(t.timetableID);
                            setIsDeleteConfirmVisible(true);
                          }}
                        />
                        <button
                          onClick={async () => {
                            try {
                              await axios.put(
                                `${backendURL}/timetable/updateTimetable/${t.timetableID}`,
                                { isPublished: !t.isPublished }
                              );
                              toast.success(
                                t.isPublished ? "Unpublished" : "Published"
                              );
                              fetchTimetables();
                            } catch {
                              toast.error("Failed to update status");
                            }
                          }}
                          className={`px-3 py-1 rounded-md text-white text-xs ${
                            t.isPublished
                              ? "bg-green-500 hover:bg-green-600"
                              : "bg-gray-500 hover:bg-gray-600"
                          }`}
                        >
                          {t.isPublished ? "Unpublish" : "Publish"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

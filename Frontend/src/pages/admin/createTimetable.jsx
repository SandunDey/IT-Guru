
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import UpdateTimetable from "./updateTimetable";
import { FaFilePdf } from "react-icons/fa";
import jsPDF from "jspdf";

const backendURL = import.meta.env.VITE_BACKEND_URL;

function buildTimeOptions() {
  const opts = [];
  const start = new Date();
  start.setHours(5, 0, 0, 0);
  const end = new Date();
  end.setHours(22, 0, 0, 0);

  const fmt = (d) =>
    d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const cur = new Date(start);
  while (cur <= end) {
    opts.push(fmt(cur));
    cur.setMinutes(cur.getMinutes() + 30);
  }
  return opts;
}

export default function CreateTimetable() {
  
  function generateReport() {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const now = new Date();
    const dateStr = now.toLocaleDateString();
    const timeStr = now.toLocaleTimeString();
    
    doc.setTextColor('#2563eb'); 
    doc.setFontSize(18);
    doc.text("IT Guru - Shedule Time Table Report", 40, 40);
    doc.setFontSize(11);
    doc.setTextColor('#64748b'); 
    doc.text(`Generated: ${dateStr} ${timeStr}`, 40, 60);
    let y = 80;
    
    const types = {};
    timetables.forEach(t => {
      if (!types[t.type]) types[t.type] = [];
      types[t.type].push(t);
    });
    Object.keys(types).forEach(type => {
      if (y > 700) { doc.addPage(); y = 40; }
      doc.setFontSize(14);
      doc.setTextColor('#2563eb');
      doc.text(type.charAt(0).toUpperCase() + type.slice(1), 40, y);
      y += 12;
      
      doc.setFillColor('#2563eb');
      doc.setTextColor('#ffffff');
      doc.rect(40, y, 515, 22, 'F');
      doc.setFontSize(10);
      doc.text("ID", 50, y + 15);
      doc.text("Date", 120, y + 15);
      doc.text("Time", 200, y + 15);
      doc.text("Subject", 300, y + 15);
      doc.text("Link", 420, y + 15);
      y += 22;
    
      types[type].forEach(t => {
        if (y > 750) { doc.addPage(); y = 40; }
        doc.setTextColor('#2563eb');
        doc.setFontSize(10);
        doc.text(String(t.TimetableID || "-"), 50, y + 15);
        const d = new Date(t.date);
        doc.text(isNaN(d.getTime()) ? String(t.date) : d.toLocaleDateString(), 120, y + 15);
        doc.text(t.time || (t.startTime && t.endTime ? `${t.startTime} - ${t.endTime}` : ""), 200, y + 15);
        doc.text(String(t.subject || "-"), 300, y + 15);
        doc.setTextColor('#2563eb');
        doc.text(String(t.link || "-"), 420, y + 15, { maxWidth: 120 });
        y += 20;
        
        doc.setDrawColor('#dbeafe');
        doc.line(40, y + 2, 555, y + 2);
      });
      y += 16;
    });
    doc.save(`ITGuru_Shedule_Report_${dateStr.replace(/\//g, '-')}.pdf`);
  }
  const [loading, setLoading] = useState(false);
  const [timetables, setTimetables] = useState([]);
  const [openUpdate, setOpenUpdate] = useState(null);
  const [openCreate, setOpenCreate] = useState(false);

  const [form, setForm] = useState({
    year: "",
    type: "theory",
    date: "",
    startTime: "",
    endTime: "",
    subject: "",
    link: "",
  });

  const timeOptions = useMemo(buildTimeOptions, []);

  function onChange(e) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  async function fetchTimetables() {
    try {
      const res = await axios.get(`${backendURL}/timetable/allTimetables`);
      setTimetables(res.data || []);
    } catch {
      toast.error("Failed to load timetables");
    }
  }

  useEffect(() => {
    fetchTimetables();
  }, []);

  async function onSubmit(e) {
    e.preventDefault();

    
    const today = new Date();
    const selectedDate = new Date(form.date);
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      toast.error("You cannot select a past date");
      return;
    }

    if (!form.startTime || !form.endTime) {
      toast.error("Please select both start and end times");
      return;
    }
    const idxStart = timeOptions.indexOf(form.startTime);
    const idxEnd = timeOptions.indexOf(form.endTime);
    if (idxEnd <= idxStart) {
      toast.error("End time must be after start time");
      return;
    }

    setLoading(true);
    try {
      const payload = { ...form, time: `${form.startTime} - ${form.endTime}` };
      await axios.post(`${backendURL}/timetable/makeTimetable`, payload);
      toast.success("Timetable created");
      setForm({
        year: "",
        type: "theory",
        date: "",
        startTime: "",
        endTime: "",
        subject: "",
        link: "",
      });
      setOpenCreate(false);
      await fetchTimetables();
    } catch (e) {
      toast.error(e?.response?.data?.message || "Create failed");
    } finally {
      setLoading(false);
    }
  }

  function confirmDelete(id) {
    toast.custom((t) => (
      <div className="bg-white shadow-md border border-red-200 rounded-lg p-4 w-[320px]">
        <p className="text-sm font-semibold text-red-700">
          Are you sure you want to delete?
        </p>
        <div className="flex justify-end gap-2 mt-3">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300 text-sm"
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              try {
                await axios.delete(
                  `${backendURL}/timetable/deleteTimetable/${id}`
                );
                toast.success("Timetable deleted");
                fetchTimetables();
              } catch {
                toast.error("Delete failed");
              } finally {
                toast.dismiss(t.id);
              }
            }}
            className="px-3 py-1 rounded-md bg-red-600 text-white hover:bg-red-700 text-sm"
          >
            Delete
          </button>
        </div>
      </div>
    ));
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100">
      <header className="border-b bg-white shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-6 flex items-center gap-3">
          <span className="text-2xl">📅</span>
          <h1 className="text-2xl md:text-3xl font-bold text-blue-700">
            Teacher Timetable
          </h1>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        <section className="bg-white shadow-md rounded-2xl border border-blue-100">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-blue-800">
                All Timetables
              </h2>
              <button
                onClick={() => setOpenCreate(true)}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                Create Timetable
              </button>
            </div>

            
            {timetables.length === 0 ? (
              <p className="text-blue-900/60">No timetables yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-center">
                  <thead className="bg-blue-50 text-blue-900">
                    <tr>
                      <th className="px-4 py-3">ID</th>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Time</th>
                      <th className="px-4 py-3">Subject</th>
                      <th className="px-4 py-3">Type</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {timetables.map((t) => {
                      const dateOnly = t.date
                        ? new Date(t.date).toLocaleDateString()
                        : "";

                      return (
                        <tr
                          key={t.TimetableID}
                          className="border-t border-blue-100 hover:bg-blue-50/40"
                        >
                          <td className="px-4 py-3">{t.TimetableID}</td>
                          <td className="px-4 py-3">{dateOnly}</td>
                          <td className="px-4 py-3">
                            {t.startTime} - {t.endTime}
                          </td>
                          <td className="px-4 py-3">{t.subject}</td>
                          <td className="px-4 py-3 capitalize">{t.type}</td>
                          <td className="px-4 py-3">
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
                          <td className="px-4 py-3 flex gap-2 justify-center">
                            <button
                              onClick={() => setOpenUpdate(t.TimetableID)}
                              className="px-3 py-1.5 rounded-md bg-yellow-500 text-white hover:bg-yellow-600 transition"
                            >
                              Update
                            </button>
                            <button
                              onClick={() => confirmDelete(t.TimetableID)}
                              className="px-3 py-1.5 rounded-md bg-red-500 text-white hover:bg-red-600 transition"
                            >
                              Delete
                            </button>
                            <button
                              onClick={async () => {
                                try {
                                  await axios.put(
                                    `${backendURL}/timetable/updateTimetable/${t.TimetableID}`,
                                    { isPublished: !t.isPublished }
                                  );
                                  toast.success(
                                    t.isPublished ? "Unpublished" : "Published"
                                  );
                                  fetchTimetables();
                                } catch {
                                  toast.error("Failed to update publish status");
                                }
                              }}
                              className={`px-3 py-1.5 rounded-md text-white transition ${
                                t.isPublished
                                  ? "bg-green-500 hover:bg-green-600"
                                  : "bg-gray-500 hover:bg-gray-600"
                              }`}
                            >
                              {t.isPublished ? "Unpublish" : "Publish"}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </main>

    
      {openCreate && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-lg">
            <h2 className="text-xl font-bold text-blue-700 mb-4 text-center">
              Create Timetable
            </h2>
            <form onSubmit={onSubmit} className="space-y-4">
              <input
                name="year"
                value={form.year}
                onChange={onChange}
                placeholder="Year (2025)"
                className="w-full border rounded-lg px-4 py-2"
                required
              />
              <select
                name="type"
                value={form.type}
                onChange={onChange}
                className="w-full border rounded-lg px-4 py-2"
              >
                <option value="theory">Theory</option>
                <option value="revision">Revision</option>
                <option value="practical">Practical</option>
              </select>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={onChange}
                min={new Date().toISOString().split("T")[0]}
                className="w-full border rounded-lg px-4 py-2"
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <select
                  name="startTime"
                  value={form.startTime}
                  onChange={onChange}
                  className="border rounded-lg px-4 py-2"
                  required
                >
                  <option value="">Start Time</option>
                  {timeOptions.map((t) => (
                    <option key={`s-${t}`} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                <select
                  name="endTime"
                  value={form.endTime}
                  onChange={onChange}
                  className="border rounded-lg px-4 py-2"
                  required
                >
                  <option value="">End Time</option>
                  {timeOptions.map((t) => (
                    <option key={`e-${t}`} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <input
                name="subject"
                value={form.subject}
                onChange={onChange}
                placeholder="Subject"
                className="w-full border rounded-lg px-4 py-2"
                required
              />
              <input
                type="url"
                name="link"
                value={form.link}
                onChange={onChange}
                placeholder="https://meet.google.com/..."
                className="w-full border rounded-lg px-4 py-2"
                required
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setOpenCreate(false)}
                  className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-60"
                >
                  {loading ? "Saving..." : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {openUpdate && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-lg">
            <h2 className="text-xl font-bold text-blue-700 mb-4 text-center">
              Update Timetable
            </h2>
            <UpdateTimetable
              timetableId={openUpdate}
              onUpdated={() => {
                setOpenUpdate(null);
                fetchTimetables();
              }}
              onCancel={() => setOpenUpdate(null)}
            />
          </div>
        </div>
      )}
      <button
        onClick={generateReport}
        className="fixed bottom-8 right-8 z-50 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg animate-pulse focus:outline-none"
        title="Generate PDF Report"
        style={{ boxShadow: '0 4px 24px 0 rgba(0,0,0,0.15)' }}
      >
        <FaFilePdf size={20} />
      </button>
    </div>
  );
}

import React, { useMemo, useState } from "react";//useMemo-memoizes expensive calculation
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const backendURL = import.meta.env.VITE_API_BASE_URL;

// build 30-min time options (05:00 → 22:00)
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

export default function CreateTimetableForm({ onCreated }) {//time table form create
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({//form -hold all data form fields 
    year: "",
    type: "theory",
    date: "",
    startTime: "",
    endTime: "",
    subject: "",
    link: "",
  });

  const navigate = useNavigate(); // navigation hook navigate another page
  const timeOptions = useMemo(buildTimeOptions, []);

//keeps the form updated with whatever the user types or selects.
  function onChange(e) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  }
//when user clicks Create.
  async function onSubmit(e) {
    e.preventDefault();

    // basic validation
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(form.date);
    if (Number.isNaN(selectedDate.getTime()) || selectedDate < today) {
      toast.error("You cannot select a past date");
      return;
    }
    if (!form.startTime || !form.endTime) {
      toast.error("Please select both start and end times");
      return;
    }
    const si = timeOptions.indexOf(form.startTime);
    const ei = timeOptions.indexOf(form.endTime);
    if (ei <= si) {
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

      onCreated?.(); // notify parent if passed
      navigate("/admin/dashboard/timetable");
    } catch (e) {
      toast.error(e?.response?.data?.message || "Create failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white shadow-md rounded-2xl border border-blue-100 p-6">
      <h2 className="text-xl font-semibold text-blue-800 mb-4">
        Create Timetable
      </h2>

      <form onSubmit={onSubmit} className="space-y-4">
        <input
          name="year"
          value={form.year}
          onChange={onChange}
          placeholder="Year (2027)"
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

        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-60"
        >
          {loading ? "Saving..." : "Create"}
        </button>
      </form>
    </div>
  );
}

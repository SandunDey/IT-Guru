import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const backendURL = import.meta.env.VITE_API_BASE_URL;

export default function UpdateTimetable({
  timetableId,
  initialData,
  onUpdated,
  onCancel,
}) {
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ Pre-fill immediately if initialData available
  useEffect(() => {
    if (initialData) {
      setForm({
        timetableID: initialData.timetableID || initialData.TimetableID || "",
        year: initialData.year || "",
        type: initialData.type || "theory",
        date: initialData.date ? initialData.date.slice(0, 10) : "",
        startTime: initialData.startTime || "",
        endTime: initialData.endTime || "",
        subject: initialData.subject || "",
        link: initialData.link || "",
      });
    }
  }, [initialData]);

  // ✅ Fallback: fetch if no initialData
  useEffect(() => {
    if (!initialData) {
      async function fetchTimetable() {
        try {
          const res = await axios.get(
            `${backendURL}/timetable/getTimetableId/${timetableId}`
          );
          const data = res.data;

          setForm({
            timetableID: data.timetableID || data.TimetableID || "",
            year: data.year || "",
            type: data.type || "theory",
            date: data.date ? data.date.slice(0, 10) : "",
            startTime: data.startTime || "",
            endTime: data.endTime || "",
            subject: data.subject || "",
            link: data.link || "",
          });
        } catch (err) {
          toast.error("Failed to load timetable");
          onCancel && onCancel();
        }
      }
      fetchTimetable();
    }
  }, [timetableId, initialData, onCancel]);

  function onChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(
        `${backendURL}/timetable/updateTimetable/${form.timetableID}`, // ✅ use lowercase timetableID
        {
          year: form.year,
          type: form.type,
          date: form.date,
          startTime: form.startTime,
          endTime: form.endTime,
          subject: form.subject,
          link: form.link,
        }
      );
      toast.success("Timetable updated");
      onUpdated && onUpdated();
    } catch (err) {
      // ✅ Log the full error for debugging
      console.error("Update failed:", err);
      if (err.response) {
        console.error("Response data:", err.response.data);
        toast.error(err.response.data.message || "Update failed");
      } else {
        toast.error("Update failed: No response from server");
      }
    } finally {
      setLoading(false);
    }
  }

  if (!form) return <div>Loading timetable...</div>;

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-blue-900 mb-1">
          Timetable ID
        </label>
        <input
          value={form.timetableID} // ✅ lowercase consistent
          readOnly
          className="w-full border rounded-lg px-4 py-2 bg-gray-100 text-gray-600"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-blue-900 mb-1">
          Year
        </label>
        <input
          name="year"
          value={form.year}
          onChange={onChange}
          placeholder="2025"
          className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-blue-900 mb-1">
          Type
        </label>
        <select
          name="type"
          value={form.type}
          onChange={onChange}
          className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
        >
          <option value="theory">Theory</option>
          <option value="revision">Revision</option>
          <option value="practical">Practical</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-blue-900 mb-1">
          Date
        </label>
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={onChange}
          className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-blue-900 mb-1">
            Start Time
          </label>
          <input
            name="startTime"
            value={form.startTime}
            onChange={onChange}
            placeholder="08:00 AM"
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-blue-900 mb-1">
            End Time
          </label>
          <input
            name="endTime"
            value={form.endTime}
            onChange={onChange}
            placeholder="09:00 AM"
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-blue-900 mb-1">
          Subject
        </label>
        <input
          name="subject"
          value={form.subject}
          onChange={onChange}
          placeholder="Subject"
          className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-blue-900 mb-1">
          Class Link
        </label>
        <input
          type="url"
          name="link"
          value={form.link}
          onChange={onChange}
          placeholder="https://meet.google.com/..."
          className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
          required
        />
      </div>

      <div className="flex gap-2 justify-end pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="py-2 px-6 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="py-2 px-6 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition disabled:opacity-60"
        >
          {loading ? "Saving..." : "Update"}
        </button>
      </div>
    </form>
  );
}
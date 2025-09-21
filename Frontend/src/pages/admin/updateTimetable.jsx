
import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const backendURL = import.meta.env.VITE_BACKEND_URL;

export default function UpdateTimetable({ timetableId, onUpdated, onCancel }) {
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchTimetable() {
      try {
        const res = await axios.get(
          `${backendURL}/timetable/getTimetableId/${timetableId}`
        );
        setForm(res.data);
      } catch {
        toast.error("Failed to load timetable");
        onCancel && onCancel();
      }
    }
    fetchTimetable();
  }, [timetableId, onCancel]);

  function onChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(
        `${backendURL}/timetable/updateTimetable/${timetableId}`,
        form
      );
      toast.success("Timetable updated");
      onUpdated && onUpdated();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  }

  if (!form) return <div>Loading...</div>;

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-blue-900 mb-1">
          Timetable ID
        </label>
        <input
          value={form.TimetableID}
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
          value={form.year || ""}
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
          value={form.type || "theory"}
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
          value={form.date ? form.date.slice(0, 10) : ""}
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
            value={form.startTime || ""}
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
            value={form.endTime || ""}
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
          value={form.subject || ""}
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
          value={form.link || ""}
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

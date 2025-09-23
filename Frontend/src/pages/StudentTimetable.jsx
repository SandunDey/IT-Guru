import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Footer from "../components/footer.jsx";
import Header from "../components/header";

const backendURL = import.meta.env.VITE_API_BASE_URL;


function formatDate(d) {
  const dt = new Date(d);
  return isNaN(dt) ? "" : dt.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" });
}
function formatTimeRange(startTime, endTime, timeField) {
  if (timeField) return timeField;
  if (!startTime || !endTime) return "";
  return `${startTime} – ${endTime}`;
}
function isUpcoming(d) {
  const today = new Date();
  today.setHours(0,0,0,0);
  const dt = new Date(d);
  return isNaN(dt) ? true : dt >= today;
}

function TimetableCard({ item }) {
  const dateStr = formatDate(item.date);
  const timeStr = formatTimeRange(item.startTime, item.endTime, item.time);

  return (
    <div className="group rounded-2xl border border-blue-100 bg-white shadow-sm hover:shadow-md transition overflow-hidden">
      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-700">
            Published
          </span>
          <span className="text-[11px] text-blue-700/70">#{item.TimetableID}</span>
        </div>

        <h3 className="text-lg font-semibold text-blue-900">{item.subject}</h3>

        <div className="mt-3 space-y-2 text-sm text-blue-900/80">
          <div className="flex items-center gap-2">
            <span className="inline-flex w-16 text-xs uppercase tracking-wide text-blue-700/70">Date</span>
            <span>{dateStr}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex w-16 text-xs uppercase tracking-wide text-blue-700/70">Time</span>
            <span className="tabular-nums">{timeStr}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex w-16 text-xs uppercase tracking-wide text-blue-700/70">Type</span>
            <span className="capitalize">{item.type}</span>
          </div>
        </div>

        <div className="mt-5">
          <a
            href={item.link}
            target="_blank"
            rel="noreferrer"
            className="w-full inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Join Class
          </a>
        </div>
      </div>
    </div>
  );
}

export default function StudentTimetable() {
  const [all, setAll] = useState([]);
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState("");
  const [type, setType] = useState("all");
  const [onlyUpcoming, setOnlyUpcoming] = useState(true);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  async function load() {
    setLoading(true);
    try {
      const res = await axios.get(`${backendURL}/timetable/allTimetables`);
      setAll(Array.isArray(res.data) ? res.data : []);
    } catch {
      setAll([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const items = useMemo(() => {
    let list = all.filter(t => t?.isPublished);            
    if (onlyUpcoming) list = list.filter(t => isUpcoming(t.date));

    if (type !== "all") list = list.filter(t => (t.type || "").toLowerCase() === type);

    if (dateFrom) list = list.filter(t => new Date(t.date) >= new Date(dateFrom));
    if (dateTo)   list = list.filter(t => new Date(t.date) <= new Date(dateTo));

    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(t =>
        (t.subject || "").toLowerCase().includes(q) ||
        (t.type || "").toLowerCase().includes(q)
      );
    }

    
    list.sort((a,b) => new Date(a.date) - new Date(b.date));
    return list;
  }, [all, query, type, onlyUpcoming, dateFrom, dateTo]);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-blue-50">
      <Header/>

      {/* <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📚</span>
            <h1 className="text-2xl md:text-3xl font-bold text-blue-700">Class Schedule</h1>
          </div>
          <span className="text-xs text-blue-900/60">Students see Published classes only</span>
        </div>
      </header> */}

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-6 pt-20">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-center pt-15">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📚</span>
            <h1 className="text-2xl md:text-3xl font-bold text-blue-700">Class Schedule</h1>
          </div>
          {/* <span className="text-xs text-blue-900/60">Students see Published classes only</span> */}
        </div>

        <section className="bg-white border border-blue-100 rounded-2xl p-4 shadow-sm">
            
          <div className="flex flex-col md:flex-row gap-3 md:items-end">
            
            <div className="flex-1">
              <label className="block text-xs font-medium text-blue-900/80 mb-1">Search</label>
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search by subject or type…"
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-blue-900/80 mb-1">Type</label>
              <select
                value={type}
                onChange={e => setType(e.target.value)}
                className="w-[180px] border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
              >
                <option value="all">All</option>
                <option value="theory">Theory</option>
                <option value="revision">Revision</option>
                <option value="practical">Practical</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-blue-900/80 mb-1">From</label>
              <input
                type="date"
                value={dateFrom}
                onChange={e => setDateFrom(e.target.value)}
                className="w-[180px] border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-blue-900/80 mb-1">To</label>
              <input
                type="date"
                value={dateTo}
                onChange={e => setDateTo(e.target.value)}
                className="w-[180px] border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="flex items-center gap-2 h-[42px] md:ml-auto">
              <input
                id="upcomingOnly"
                type="checkbox"
                checked={onlyUpcoming}
                onChange={e => setOnlyUpcoming(e.target.checked)}
                className="h-4 w-4 rounded border-blue-300 text-blue-600 focus:ring-blue-400"
              />
              <label htmlFor="upcomingOnly" className="text-sm text-blue-900/80">Upcoming only</label>
            </div>
          </div>
        </section>


        {loading ? (
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_,i) => (
              <div key={i} className="h-44 rounded-2xl bg-blue-100/50 animate-pulse" />
            ))}
          </section>
        ) : items.length === 0 ? (
          <section className="bg-white border border-blue-100 rounded-2xl p-10 text-center text-blue-900/70">
            No classes found. Try changing filters.
          </section>
        ) : (
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {items.map((t) => (
              <TimetableCard key={t.TimetableID} item={t} />
            ))}
          </section>
        )}
      </main>
      <Footer/>
    </div>
  );
}

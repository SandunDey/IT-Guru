import React, { useEffect, useMemo, useState } from "react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from "recharts";

/** VERY LIGHT “REAL-TIME” STORE
 * We read teacher data from localStorage and listen for cross-tab updates via BroadcastChannel.
 * Anywhere else in your app, when you create/update/delete, also write to localStorage("itguru-teacher").
 */
function useRealtimeTeacherData() {
  const key = "itguru-teacher";
  const [data, setData] = useState(() => {
    const initial = localStorage.getItem(key);
    if (initial) return JSON.parse(initial);
    const seed = {
      brand: "ITGuru",
      materials: [{ id: "m1", title: "Database Normalization Notes", batch: "Batch 1", week: 3, type: "Note" }],
      quizzes: [
        { id: "q1", title: "Algebra Check", batch: "Batch 2", totalMarks: 9, duration: 30, published: false },
        { id: "q2", title: "testQuiz", batch: "Batch 2", totalMarks: 5, duration: 30, published: false },
      ],
      videos: [],
      stats: {
        avgScoresByWeek: [
          { w: "W1", b1: 60, b2: 45 },
          { w: "W2", b1: 70, b2: 55 },
          { w: "W3", b1: 50, b2: 68 },
          { w: "W4", b1: 75, b2: 62 },
          { w: "W5", b1: 65, b2: 58 },
          { w: "W6", b1: 55, b2: 70 },
          { w: "W7", b1: 50, b2: 68 },
          { w: "W8", b1: 75, b2: 72 },
        ],
        assessmentLoadByMonth: [
          { m: "Jan", count: 0 }, { m: "Feb", count: 0 }, { m: "Mar", count: 0 }, { m: "Apr", count: 0 },
          { m: "May", count: 0 }, { m: "Jun", count: 0 }, { m: "Jul", count: 0 }, { m: "Aug", count: 0 },
          { m: "Sept", count: 2 }, { m: "Oct", count: 0 }, { m: "Nov", count: 0 }, { m: "Dec", count: 0 },
        ],
        progressDemo: [
          { batch: "Batch 1", completion: 78 },
          { batch: "Batch 2", completion: 65 },
        ],
      },
    };
    localStorage.setItem(key, JSON.stringify(seed));
    return seed;
  });

  useEffect(() => {
    const bc = new BroadcastChannel("itguru-teacher");
    const onMsg = (e) => {
      if (e?.data?.type === "refresh") {
        const latest = localStorage.getItem(key);
        if (latest) setData(JSON.parse(latest));
      }
    };
    bc.addEventListener("message", onMsg);

    // Optional polling every 10s for “real-time” feel even within one tab
    const t = setInterval(() => {
      const latest = localStorage.getItem(key);
      if (latest) setData(JSON.parse(latest));
    }, 10000);

    return () => {
      bc.removeEventListener("message", onMsg);
      bc.close();
      clearInterval(t);
    };
  }, []);

  return data;
}

export default function OverviewSection() {
  const store = useRealtimeTeacherData();

  const metrics = useMemo(() => {
    const upcoming = 0; // placeholder; tie to dates if you add schedule
    const published = store.quizzes.filter(q => q.published).length;
    return {
      materials: store.materials.length,
      quizzes: store.quizzes.length,
      published,
      upcoming,
    };
  }, [store]);

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="rounded-2xl bg-white shadow p-5">
          <div className="text-sm text-gray-500">Materials</div>
          <div className="text-3xl font-semibold">{metrics.materials}</div>
        </div>
        <div className="rounded-2xl bg-white shadow p-5">
          <div className="text-sm text-gray-500">Assessments</div>
          <div className="text-3xl font-semibold">{metrics.quizzes}</div>
        </div>
        <div className="rounded-2xl bg-white shadow p-5">
          <div className="text-sm text-gray-500">Published</div>
          <div className="text-3xl font-semibold">{metrics.published}</div>
        </div>
        <div className="rounded-2xl bg-white shadow p-5">
          <div className="text-sm text-gray-500">Upcoming</div>
          <div className="text-3xl font-semibold">{metrics.upcoming}</div>
        </div>
      </div>

      {/* Line: Average Scores by Week (demo) */}
      <section className="rounded-2xl bg-white shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Average Scores by Week (demo)</h3>
        {/* <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={store.stats.avgScoresByWeek}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="w" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="b1" name="Batch 1" />
              <Line type="monotone" dataKey="b2" name="Batch 2" />
            </LineChart>
          </ResponsiveContainer>
        </div> */}
      </section>

      {/* Bar: Assessment Load */}
      <section className="rounded-2xl bg-white shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Assessment Load (count by month)</h3>
        {/* <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={store.stats.assessmentLoadByMonth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="m" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" name="Assessments" />
            </BarChart>
          </ResponsiveContainer>
        </div> */}
      </section>

      {/* Bar: Student Progress demo */}
      <section className="rounded-2xl bg-white shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Student Progress (demo)</h3>
        {/* <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={store.stats.progressDemo}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="batch" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="completion" name="completion : %" />
            </BarChart>
          </ResponsiveContainer>
        </div> */}
      </section>
    </div>
  );
}

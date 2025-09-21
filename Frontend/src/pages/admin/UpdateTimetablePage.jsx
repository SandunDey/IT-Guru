
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import UpdateTimetable from "./updateTimetable";

export default function UpdateTimetablePage() {
  const { timetableId } = useParams();
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6 text-blue-700">Update Timetable</h2>
        <UpdateTimetable
          timetableId={timetableId}
          onUpdated={() => navigate("/timetable")}
          onCancel={() => navigate("/timetable")}
        />
      </div>
    </div>
  );
}

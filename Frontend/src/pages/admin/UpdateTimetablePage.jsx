import { useLocation, useParams, useNavigate } from "react-router-dom";
import UpdateTimetable from "./updateTimetable.jsx";

export default function UpdateTimetablePage() {
  const { timetableID } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // timetable object if passed from list
  const timetable = location.state?.timetable;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Update Timetable</h1>
      <UpdateTimetable
        timetableId={timetableID}
        initialData={timetable} // ✅ pass optional state data
        onUpdated={() => navigate("/admin/dashboard/timetable")}
        onCancel={() => navigate("/admin/dashboard/timetable")}
      />
    </div>
  );
}

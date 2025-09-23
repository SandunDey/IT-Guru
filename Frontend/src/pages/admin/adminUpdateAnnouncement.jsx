import { useState } from "react";//input value manage hook
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

export default function UpdateAnnouncementPage() {
  const location = useLocation(); //update ekt enkot data tikath navigate vunad kiyala balann use karan hook ek

  const [announcementID, setAnnouncementID] = useState(
    location.state.announcementID
  );
  const [title, setTitle] = useState(location.state.title);//location kiyanne navigate venakot state ekath ekk genapu data thiyen ekk
  const [description, setDescription] = useState(location.state.description);
  const [type, setType] = useState(location.state.type);
  const [audience, setAudience] = useState(location.state.audience);
  const [expiryDate, setExpiryDate] = useState(location.state.expiryDate);

  function handleAudienceChange(e) {
    const value = e.target.value;
    if (e.target.checked) {
      setAudience([...audience, value]);
    } else {
      setAudience(audience.filter((a) => a !== value));
    }
  }

  const navigate = useNavigate();

  async function updateAnnouncement() {
    const token = localStorage.getItem("token");

    if (token == null) {
      navigate("/login");
      return;
    }

    try {
      //backend ekt yavann ona json ek
      const announcement = {
        announcementID: announcementID,
        title: title,
        description: description,
        type: type,
        audience: audience,
        expiryDate: expiryDate,
      };

      //backend call
      await axios.put(
        import.meta.env.VITE_API_BASE_URL +
          "/api/announcements/" +
          announcementID,
        announcement,
        {
          //1-> yavann ona url ek , import
          //2-> announcement
          //3-> token
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      toast.success("Announcement Updated Successfully");
      navigate("/admin/dashboard/announcements");
    } catch {
      console.log(error);
      toast.error("An error Occurred");
    }
  }

  return (
    <div className="w-full min-h-screen flex justify-center items-start bg-gray-50 py-12 px-4">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-gray-200 p-10">
        <h2 className="text-3xl font-semibold text-accent mb-8 border-b pb-3">
          Update Announcement
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Announceent ID */}
          {/*input eke value ek vidiyt thiyenna ona variable agaya*/}
          <div>
            <label className="block text-sm font-medium text-shadow-indigo-950 mb-2">
              Announcement ID
            </label>
            <input
              className="w-full p-3 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm transition"
              disabled
              value={announcementID}
              onChange={(e) => setAnnouncementID(e.target.value)}
            />
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-shadow-indigo-950 mb-2">
              Title
            </label>
            <input
              className="w-full p-3 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm transition"
              placeholder="e.g., System maintain"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-shadow-indigo-950 mb-2">
              Description
            </label>
            <textarea
              rows={4}
              className="w-full p-3 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm transition"
              placeholder="Brief product overview, benefits, and usage."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-shadow-indigo-950 mb-2">
              Type
            </label>
            <select
              className="w-full p-3 border rounded-lg border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm transition"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="Academic">Academic</option>
              <option value="Payment">Payment</option>
              <option value="Event">Event</option>
              <option value="System">System</option>
              <option value="General">General</option>
            </select>
          </div>

          {/* Audience */}{/******************************************************************/}
          <div>
            <label className="block text-sm font-medium text-shadow-indigo-950 mb-2">
              Audience      
            </label>
            <div className="flex flex-col gap-2">
              {["Student", "Parent", "Teacher", "Staff"].map((aud) => (
                <label key={aud} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    value={aud}
                    checked={audience.includes(aud)}
                    onChange={handleAudienceChange}
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  {aud}
                </label>
              ))}
            </div>
          </div>

          {/* Expiry Date */}
          <div>
            <label className="block text-sm font-medium text-shadow-indigo-950 mb-2">
              Expiry Date
            </label>
            <input
              type="date"
              className="w-full p-3 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm transition"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
            />
          </div>
        </div>

        {/* Submit / Cancel button */}
        <div className="mt-8 flex justify-end gap-4">
          <button
            onClick={() => navigate("/admin/dashboard/announcements")}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg shadow-md transition"
          >
            Cancel Announcement
          </button>

          <button
            onClick={updateAnnouncement}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg shadow-md transition"
          >
            Update Announcement
          </button>
        </div>
      </div>
    </div>
  );
}

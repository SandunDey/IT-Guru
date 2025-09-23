import { useState } from "react"; //React built-in hook handle data state
import { useNavigate } from "react-router-dom"; //React Router DOM hook navigate karanva
import toast from "react-hot-toast"; //react-hot-toast library eken, notification pennanna
import axios from "axios"; //HTTP requests karanna library.

export default function AddAnnouncementPage() {
  //form eke variable handle karanava useState valin
  const [announcementID, setAnnouncementID] = useState(""); //default empty string
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("Academic");
  const [audience, setAudience] = useState([]);
  const [expiryDate, setExpiryDate] = useState("");

  const [errors, setErrors] = useState({}); // form errors
  const navigate = useNavigate();

  // Audience checkbox select/deselect karana function
  function handleAudienceChange(e) {
    // e-> event parameter
    const value = e.target.value; // checkbox ekem ena value gannva
    if (e.target.checked) {
      setAudience([...audience, value]); //select unanm kalim audiance list ekat new value add karanva
    } else {
      setAudience(audience.filter((a) => a !== value)); // unselect nm remove karanva
    }
  }

  // Form validation function
  const validateForm = () => {
    const newErrors = {}; // empty error object
    if (!announcementID.trim())
      newErrors.announcementID = "Announcement ID is required";
    if (!title.trim()) newErrors.title = "Title is required";
    if (!description.trim()) newErrors.description = "Description is required";
    if (!type.trim()) newErrors.type = "Type is required";
    if (!audience.length) newErrors.audience = "Select at least one audience";
    if (!expiryDate) newErrors.expiryDate = "Expiry Date is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // valid if no errors
  };

  async function addAnnouncement() {
    if (!validateForm()) return; //validation failnm stop karanva
    const token = localStorage.getItem("token"); //local storage token ek gannva

    if (token == null) {
      //token nathnm login page ekt navigate
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
      await axios.post(
        import.meta.env.VITE_API_BASE_URL + "/api/announcements",
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

      toast.success("Announcement Added Successfully");
      navigate("/admin/dashboard/announcements");
    } catch {
      toast.error("An error Occurred");
    }
  }

  return (
    <div className="w-full min-h-screen flex justify-center items-start bg-gray-50 py-12 px-4">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-gray-200 p-10">
        <h2 className="text-3xl font-semibold text-accent mb-8 border-b pb-3">
          Add Announcement
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Announcement ID */}
          
          <div>
            <label className="block text-sm font-medium text-shadow-indigo-950 mb-2">
              Announcement ID
            </label>{/*input eke value ek vidiyt thiyenna ona variable agaya*/}
            <input
              className="w-full p-3 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm transition"
              placeholder="e.g., AN001"
              value={announcementID}
              onChange={(e) => setAnnouncementID(e.target.value)} //Input field ekata type karana value eka, state variable announcementID ekata gannawa.
            />
            {errors.announcementID && ( //validation
              <p className="text-red-600 text-sm italic mt-1">
                {errors.announcementID}
              </p>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-shadow-indigo-950 mb-2">
              Title
            </label>
            <input
              className="w-full p-3 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm transition"
              placeholder="e.g., System Maintain"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            {errors.title && (
              <p className="text-red-600 text-sm italic mt-1">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-shadow-indigo-950 mb-2">
              Description
            </label>
            <textarea
              rows={4}
              className="w-full p-3 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm transition"
              placeholder="Brief Announcement overview."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            {errors.description && (
              <p className="text-red-600 text-sm italic mt-1">
                {errors.description}
              </p>
            )}
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
            {errors.type && (
              <p className="text-red-600 text-sm italic mt-1">{errors.type}</p>
            )}
          </div>

          {/* Audience */}
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
            {errors.audience && (
              <p className="text-red-600 text-sm italic mt-1">
                {errors.audience}
              </p>
            )}
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
            {errors.expiryDate && (
              <p className="text-red-600 text-sm italic mt-1">
                {errors.expiryDate}
              </p>
            )}
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
            onClick={addAnnouncement}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg shadow-md transition"
          >
            Save Announcement
          </button>
        </div>
      </div>
    </div>
  );
}

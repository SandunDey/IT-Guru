import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/header";

export default function UserAnnouncementPage() {
  const [announcements, setAnnouncements] = useState([]);
  const [filteredAnnouncements, setFilteredAnnouncements] = useState([]);
  const [typeFilter, setTypeFilter] = useState("All");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchAnnouncements() {
      try {
        const response = await axios.get(
          import.meta.env.VITE_API_BASE_URL + "/api/announcements"
        );
        setAnnouncements(response.data);
        setFilteredAnnouncements(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching announcements:", error);
        setIsLoading(false);
      }
    }

    fetchAnnouncements();
  }, []);

  useEffect(() => {
    if (typeFilter === "All") {
      setFilteredAnnouncements(announcements);
    } else {
      setFilteredAnnouncements(
        announcements.filter((a) => a.type === typeFilter)
      );
    }
  }, [typeFilter, announcements]);

  return (
    <div className="w-full min-h-screen bg-gray-100 py-16 px-4">
      {" "}
      {/* lighter bg and more top padding */}
      <Header />
      <div className="max-w-5xl mx-auto mt-8">
        {" "}
        {/* add margin-top so heading is below header */}
        <h1 className="text-4xl font-bold text-center mb-10 mt-20 text-accent drop-shadow-md ">
          Announcements
        </h1>
        {/* Filter Dropdown */}
        <div className="flex justify-center mb-6">
          <select
            className="p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Academic">Academic</option>
            <option value="Payment">Payment</option>
            <option value="Event">Event</option>
            <option value="System">System</option>
            <option value="General">General</option>
          </select>
        </div>
        {/* Announcement Cards */}
        {isLoading ? (
          <p className="text-center text-gray-500">Loading announcements...</p>
        ) : filteredAnnouncements.length === 0 ? (
          <p className="text-center text-gray-500">No announcements found.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {filteredAnnouncements.map((item) => (
              <div
                key={item.announcementID}
                className="bg-white shadow-md rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition"
              >
                <h2 className="text-xl font-semibold text-indigo-600 mb-2">
                  {item.title}
                </h2>
                <p className="text-gray-700 mb-4">{item.description}</p>

                <div className="flex flex-wrap gap-2 mb-2">
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
                    {item.type}
                  </span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                    {item.audience.join(", ")}
                  </span>
                </div>

                <p className="text-sm text-gray-500">
                  Expiry: {new Date(item.expiryDate).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

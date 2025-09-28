import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaRegEdit, FaRegPlusSquare, FaTrashAlt } from "react-icons/fa";
import { IoClose, IoTrashOutline } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { Loder } from "../../components/loder";
import { TbReportAnalytics } from "react-icons/tb";

/* ---------------- Delete-Confirm Modal ---------------- */
function AnnouncementDeleteConfirm({ announcementID, close, refresh }) {
  const deleteAnnouncement = () => {
    const token = localStorage.getItem("token");
    axios
      .delete(
        `${import.meta.env.VITE_API_BASE_URL}/api/announcements/${announcementID}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        toast.success("Announcement deleted ✌️");
        close();
        refresh();
      })
      .catch(() => toast.error("Delete failed. Try again."));
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex justify-center items-center px-4">
      <div className="bg-gradient-to-br from-indigo-50 to-purple-100 rounded-2xl shadow-xl w-full max-w-md relative p-6">
        {/* Close */}
        <button
          onClick={close}
          className="absolute top-[-42px] right-[-42px] w-10 h-10 bg-white hover:bg-red-500 rounded-full flex justify-center items-center"
        >
          <IoClose className="text-gray-700 text-lg" />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
            <FaTrashAlt className="text-2xl" />
          </div>
        </div>

        <h2 className="text-xl font-semibold text-center mb-2 text-gray-800">
          Delete Announcement
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Sure you wanna nuke&nbsp;
          <span className="font-bold">{announcementID}</span>? This can’t be
          undone.
        </p>

        <div className="flex justify-center gap-4">
          <button
            onClick={close}
            className="px-5 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={deleteAnnouncement}
            className="px-5 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Main Page ---------------- */
export default function AdminAnnouncementPage() {
  const [announcements, setAnnouncements] = useState([]);
  const [isDeleteConfirmVisible, setIsDeleteConfirmVisible] = useState(false);
  const [selectedAnnouncementID, setSelectedAnnouncementID] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) {
      axios
        .get(`${import.meta.env.VITE_API_BASE_URL}/api/announcements`)
        .then((res) => {
          setAnnouncements(res.data);
          setIsLoading(false);
        })
        .catch(() => toast.error("Failed to fetch announcements"));
    }
  }, [isLoading]);

  return (
    <div className="w-full h-full p-6 bg-gradient-to-br from-indigo-100 to-purple-200 min-h-screen">
      {isDeleteConfirmVisible && (
        <AnnouncementDeleteConfirm
          announcementID={selectedAnnouncementID}
          close={() => setIsDeleteConfirmVisible(false)}
          refresh={() => setIsLoading(true)}
        />
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-indigo-800">
          Announcement Management
        </h1>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/dashboard/add-announcements"
            className="flex items-center bg-indigo-700 text-white font-semibold px-5 py-2 rounded-lg shadow-md hover:bg-indigo-800 transition"
          >
            <FaRegPlusSquare className="text-xl mr-2" />
            Add
          </Link>

          <Link
            to="/admin/dashboard/announcement-report"
            className="flex items-center bg-purple-700 text-white font-semibold px-5 py-2 rounded-lg shadow-md hover:bg-purple-800 transition"
          >
            <TbReportAnalytics className="text-xl mr-2" />
            Report
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl shadow-lg border border-indigo-300">
        {isLoading ? (
          <Loder />
        ) : (
          <table className="w-full border-collapse">
            <thead className="bg-indigo-600 text-white font-bold">
              <tr>
                <th className="py-3 px-4 text-sm">ID</th>
                <th className="py-3 px-4 text-sm">Title</th>
                <th className="py-3 px-4 text-sm">Type</th>
                <th className="py-3 px-4 text-sm">Audience</th>
                <th className="py-3 px-4 text-sm">Expiry</th>
                <th className="py-3 px-4 text-sm">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-indigo-200 bg-white">
              {announcements.map((item) => (
                <tr
                  key={item.announcementID}
                  className="hover:bg-indigo-50 transition"
                >
                  <td className="py-3 px-4 font-semibold text-indigo-700">
                    {item.announcementID}
                  </td>
                  <td className="py-3 px-4">{item.title}</td>
                  <td className="py-3 px-4">{item.type}</td>
                  <td className="py-3 px-4">{item.audience.join(", ")}</td>
                  <td className="py-3 px-4">
                    {new Date(item.expiryDate).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-4 justify-center">
                      <FaRegEdit
                        className="cursor-pointer hover:text-indigo-600 hover:scale-110 transition-transform"
                        onClick={() =>
                          navigate("/admin/dashboard/update-announcements", {
                            state: item,
                          })
                        }
                      />
                      <IoTrashOutline
                        className="cursor-pointer hover:text-red-500 hover:scale-110 transition-transform"
                        onClick={() => {
                          setSelectedAnnouncementID(item.announcementID);
                          setIsDeleteConfirmVisible(true);
                        }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

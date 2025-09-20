// src/adminPage.jsx
import { Link, Route, Routes } from "react-router-dom";
import { HiOutlineUserAdd } from "react-icons/hi";
import { LuLayoutDashboard } from "react-icons/lu";
import { FiUsers } from "react-icons/fi";
import { FaRegCalendarTimes, FaRegMoneyBillAlt, FaSignOutAlt } from "react-icons/fa";
import { TfiAnnouncement } from "react-icons/tfi";
import { MdOutlineFeedback, MdOutlineVerifiedUser, MdSpeed } from "react-icons/md";
import { BiSupport } from "react-icons/bi";

import AdminAnnouncementPage from "./admin/adminAnnouncementPage";
import AddAnnouncementPage from "./admin/adminAddNewAnnouncement";
import UpdateAnnouncementPage from "./admin/adminUpdateAnnouncement";
import AnnouncementReport from "./announcementReport";

export default function AdminPage() {
  return (
    <div
      className="w-full min-h-screen flex p-2 text-black"
      // page background handled globally by index.css; no extra bg here
    >
      {/* Sidebar */}
      <div
        className="w-[300px] h-full flex flex-col items-center gap-5 overflow-y-auto scrollbar-hide"
        style={{
          // use your token from index.css
          background: "var(--bg-blue-200)",
          color: "var(--color-ink)",
          borderRadius: "12px",
        }}
      >
        <div className="flex flex-row w-[90%] h-[70px] items-center rounded-2xl mb-[20px]">
          <img
            src="/logo.jpg"
            alt="ITGuru- e-Tution Platform"
            className="h-[70px] rounded-full"
          />
          <span className="text-white text-2xl font-semibold ml-4">Admin Panel</span>
        </div>

        {/* Reusable link styles */}
        <nav className="w-full flex flex-col items-center gap-2">
          <Link
            to="/admin/dashboard"
            className="w-[90%] flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ease-in-out hover:scale-105 hover:rounded-2xl shadow-sm hover:shadow-md"
            style={{ background: "rgba(255,255,255,.15)", backdropFilter: "blur(2px)" }}
          >
            <LuLayoutDashboard className="text-xl" />
            Dashboard
          </Link>

          <Link
            to="/admin/dashboard/users"
            className="w-[90%] flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ease-in-out hover:scale-105 hover:rounded-2xl shadow-sm hover:shadow-md"
            style={{ background: "rgba(255,255,255,.10)" }}
          >
            <FiUsers className="text-xl" />
            Manage Users
          </Link>

          <Link
            to="/admin/dashboard/staff"
            className="w-[90%] flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ease-in-out hover:scale-105 hover:rounded-2xl shadow-sm hover:shadow-md"
            style={{ background: "rgba(255,255,255,.10)" }}
          >
            <HiOutlineUserAdd className="text-xl" />
            Manage Staff
          </Link>

          <Link
            to="/admin/dashboard/payment"
            className="w-[90%] flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ease-in-out hover:scale-105 hover:rounded-2xl shadow-sm hover:shadow-md"
            style={{ background: "rgba(255,255,255,.10)" }}
          >
            <FaRegMoneyBillAlt className="text-xl" />
            Manage Payment
          </Link>

          <Link
            to="/admin/dashboard/announcements"
            className="w-[90%] flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ease-in-out hover:scale-105 hover:rounded-2xl shadow-sm hover:shadow-md"
            style={{ background: "rgba(255,255,255,.10)" }}
          >
            <TfiAnnouncement className="text-xl" />
            Manage Announcement
          </Link>

          <Link
            to="/admin/dashboard/enrollment"
            className="w-[90%] flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ease-in-out hover:scale-105 hover:rounded-2xl shadow-sm hover:shadow-md"
            style={{ background: "rgba(255,255,255,.10)" }}
          >
            <MdOutlineVerifiedUser className="text-xl" />
            Manage Enrollment
          </Link>

          <Link
            to="/admin/dashboard/timetable"
            className="w-[90%] flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ease-in-out hover:scale-105 hover:rounded-2xl shadow-sm hover:shadow-md"
            style={{ background: "rgba(255,255,255,.10)" }}
          >
            <FaRegCalendarTimes className="text-xl" />
            Manage Time Table
          </Link>

          <Link
            to="/admin/dashboard/performance"
            className="w-[90%] flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ease-in-out hover:scale-105 hover:rounded-2xl shadow-sm hover:shadow-md"
            style={{ background: "rgba(255,255,255,.10)" }}
          >
            <MdSpeed className="text-xl" />
            Manage Performance
          </Link>

          <Link
            to="/admin/dashboard/feedback"
            className="w-[90%] flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ease-in-out hover:scale-105 hover:rounded-2xl shadow-sm hover:shadow-md"
            style={{ background: "rgba(255,255,255,.10)" }}
          >
            <MdOutlineFeedback className="text-xl" />
            Manage Feedback
          </Link>

          <Link
            to="/admin/dashboard/supportTicket"
            className="w-[90%] flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ease-in-out hover:scale-105 hover:rounded-2xl shadow-sm hover:shadow-md"
            style={{ background: "rgba(255,255,255,.10)" }}
          >
            <BiSupport className="text-xl" />
            Manage Support Ticket
          </Link>
        </nav>

        {/* Bottom Logout Button */}
        <div className="w-[120px] flex justify-center items-center mb-4">
          <button
            onClick={() => alert("Logging out...")}
            className="w-[90%] flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ease-in-out hover:scale-105 shadow-md"
            style={{ background: "#dc2626", color: "#fff" }} // red-600
          >
            <FaSignOutAlt className="text-xl" />
            Logout
          </button>
        </div>
      </div>

      {/* Main panel */}
      <div
        className="w-[calc(100%-300px)] h-full rounded-[20px] overflow-hidden"
        style={{
          background: "var(--card)",
          border: "4px solid var(--border)",
        }}
      >
        <div className="w-full max-w-full h-full max-h-full overflow-y-scroll bg-transparent">
          <Routes>
            <Route path="/" element={<h1 className="p-6">Dashboard</h1>} />
            <Route path="/users" element={<h1 className="p-6">User</h1>} />
            <Route path="/staff" element={<h1 className="p-6">Staff</h1>} />
            <Route path="/payment" element={<h1 className="p-6">Payment</h1>} />
            <Route path="/announcements" element={<AdminAnnouncementPage />} />
            <Route path="/enrollment" element={<h1 className="p-6">Enrollment</h1>} />
            <Route path="/timetable" element={<h1 className="p-6">Time Table</h1>} />
            <Route path="/performance" element={<h1 className="p-6">Performance</h1>} />
            <Route path="/feedback" element={<h1 className="p-6">Feedback</h1>} />
            <Route path="/supportTicket" element={<h1 className="p-6">Support Ticket</h1>} />
            <Route path="add-announcements" element={<AddAnnouncementPage />} />
            <Route path="update-announcements" element={<UpdateAnnouncementPage />} />
            <Route path="announcement-report" element={<AnnouncementReport />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

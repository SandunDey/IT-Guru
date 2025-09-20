import { Link, Route, Routes } from "react-router-dom";
import { HiOutlineUserAdd, HiOutlineUsers } from "react-icons/hi";
import { LuLayoutDashboard } from "react-icons/lu";
import { FiUsers } from "react-icons/fi";
import {
  FaRegCalendarTimes,
  FaRegMoneyBillAlt,
  FaSignOutAlt,
} from "react-icons/fa";
import { TfiAnnouncement } from "react-icons/tfi";
import {
  MdOutlineFeedback,
  MdOutlineVerifiedUser,
  MdSpeed,
} from "react-icons/md";
import { BiSupport } from "react-icons/bi";
import AdminAnnouncementPage from "./admin/adminAnnouncementPage";
import AddAnnouncementPage from "./admin/adminAddNewAnnouncement";
import UpdateAnnouncementPage from "./admin/adminUpdateAnnouncement";
import AnnouncementReport from "./announcementReport";

import AdminEnrollmentPage from "./admin/adminEnrollmentPage";
import UpdateEnrollmentPage from "./admin/adminUpdateEnrollment";
import EnrollmentReport from "./enrollmentReport";
import AdminTicketsPage from "./admin/AdminTicketsPage"; // Import the Support Tickets page

export default function AdminPage() {
  return (
    <div className="w-full h-full bg-accent flex p-2">
      <div className="w-[300px] h-full bg-accent flex flex-col items-center gap-5 text-white overflow-y-auto scrollbar-hide">
        <div className="flex flex-row w-[90%] h-[70px]  items-center rounded-2xl mb-[20px]">
          <img
            src="/logo.jpg"
            alt="ITGuru- e-Tution Platform"
            className="h-[70px] rounded-full
            "
          />
          <span className="text-white text-2xl font-semibold  ml-4">
            Admin Panel
          </span>
        </div>

        <Link
          to="/admin/dashboard"
          className="w-[90%] flex items-center gap-2 px-4 py-2 rounded-lg 
             transition-all duration-300 ease-in-out
             hover:scale-105 hover:rounded-2xl 
             hover:bg-boardercolor hover:bg-opacity-80
             shadow-sm hover:shadow-md"
        >
          <LuLayoutDashboard className="text-xl" />
          Dashboard
        </Link>

        <Link
          to="/admin/dashboard/users"
          className="w-[90%] flex items-center gap-2 px-4 py-2 rounded-lg 
             transition-all duration-300 ease-in-out
             hover:scale-105 hover:rounded-2xl 
             hover:bg-boardercolor hover:bg-opacity-80
             shadow-sm hover:shadow-md"
        >
          <FiUsers className="text-xl" />
          Manage Users
        </Link>

        <Link
          to="/admin/dashboard/staff"
          className="w-[90%] flex items-center gap-2 px-4 py-2 rounded-lg 
             transition-all duration-300 ease-in-out
             hover:scale-105 hover:rounded-2xl 
             hover:bg-boardercolor hover:bg-opacity-80
             shadow-sm hover:shadow-md"
        >
          <HiOutlineUserAdd className="text-xl" />
          Manage Staff
        </Link>

        <Link
          to="/admin/dashboard/payment"
          className="w-[90%] flex items-center gap-2 px-4 py-2 rounded-lg 
             transition-all duration-300 ease-in-out
             hover:scale-105 hover:rounded-2xl 
             hover:bg-boardercolor hover:bg-opacity-80
             shadow-sm hover:shadow-md"
        >
          <FaRegMoneyBillAlt className="text-xl" />
          Manage Payment
        </Link>

        <Link
          to="/admin/dashboard/announcements"
          className="w-[90%] flex items-center gap-2 px-4 py-2 rounded-lg 
             transition-all duration-300 ease-in-out
             hover:scale-105 hover:rounded-2xl 
             hover:bg-boardercolor hover:bg-opacity-80
             shadow-sm hover:shadow-md"
        >
          <TfiAnnouncement className="text-xl" />
          Manage Announcement
        </Link>

        <Link
          to="/admin/dashboard/enrollment"
          className="w-[90%] flex items-center gap-2 px-4 py-2 rounded-lg 
             transition-all duration-300 ease-in-out
             hover:scale-105 hover:rounded-2xl 
             hover:bg-boardercolor hover:bg-opacity-80
             shadow-sm hover:shadow-md"
        >
          <MdOutlineVerifiedUser className="text-xl" />
          Manage Enrollment
        </Link>

        <Link
          to="/admin/dashboard/timetable"
          className="w-[90%] flex items-center gap-2 px-4 py-2 rounded-lg 
             transition-all duration-300 ease-in-out
             hover:scale-105 hover:rounded-2xl 
             hover:bg-boardercolor hover:bg-opacity-80
             shadow-sm hover:shadow-md"
        >
          <FaRegCalendarTimes className="text-xl" />
          Manage Time Table
        </Link>

        <Link
          to="/admin/dashboard/performance"
          className="w-[90%] flex items-center gap-2 px-4 py-2 rounded-lg 
             transition-all duration-300 ease-in-out
             hover:scale-105 hover:rounded-2xl 
             hover:bg-boardercolor hover:bg-opacity-80
             shadow-sm hover:shadow-md"
        >
          <MdSpeed className="text-xl" />
          Manage Performance
        </Link>

        <Link
          to="/admin/dashboard/feedback"
          className="w-[90%] flex items-center gap-2 px-4 py-2 rounded-lg 
             transition-all duration-300 ease-in-out
             hover:scale-105 hover:rounded-2xl 
             hover:bg-boardercolor hover:bg-opacity-80
             shadow-sm hover:shadow-md"
        >
          <MdOutlineFeedback className="text-xl" />
          Manage Feedback
        </Link>

        <Link
          to="/admin/dashboard/supportTicket"
          className="w-[90%] flex items-center gap-2 px-4 py-2 rounded-lg 
             transition-all duration-300 ease-in-out
             hover:scale-105 hover:rounded-2xl 
             hover:bg-boardercolor hover:bg-opacity-80
             shadow-sm hover:shadow-md"
        >
          <BiSupport className="text-xl" />
          Manage Support Ticket
        </Link>

        {/* Bottom Logout Button */}
        <div className="w-[120px] flex justify-center items-center mb-4">
          <button
            onClick={() => alert("Logging out...")}
            className="w-[90%] flex items-center justify-center gap-2 px-4 py-2 rounded-lg 
               bg-red-600 hover:bg-red-700 transition-all duration-300 ease-in-out 
               hover:scale-105 shadow-md"
          >
            <FaSignOutAlt className="text-xl" />
            Logout
          </button>
        </div>
      </div>

      <div className="w-[calc(100%-300px)] h-full border-[4px] border-boardercolor bg-primary rounded-[20px] overflow-hidden">
        {/*w-> meke width eka sampurana with ekem (100%) adu karann 300px. calcuylation part danne calc() athule */}
        <div className=" w-full max-w-full h-full max-h-full overflow-y-scroll">
          <Routes>
            <Route path="/" element={<h1>Dashboard</h1>} />
            <Route path="/users" element={<h1>User</h1>} />
            <Route path="/staff" element={<h1>Staff</h1>} />
            <Route path="/payment" element={<h1>Payment</h1>} />
            <Route path="/announcements" element={<AdminAnnouncementPage />} />
            <Route path="/enrollment" element={<AdminEnrollmentPage />} />
            <Route path="/timetable" element={<h1>Time Table</h1>} />
            <Route path="/performance" element={<h1>performance</h1>} />
            <Route path="/feedback" element={<h1>feedback</h1>} />
            <Route path="/supportTicket" element={<AdminTicketsPage />} />
            <Route path="add-announcements" element={<AddAnnouncementPage />} />
            <Route
              path="update-announcements"
              element={<UpdateAnnouncementPage />}
            />
            <Route
              path="update-enrollments"
              element={<UpdateEnrollmentPage />}
            />
            <Route
              path="announcement-report"
              element={<AnnouncementReport />}
            />
            <Route path="enrollment-report" element={<EnrollmentReport />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

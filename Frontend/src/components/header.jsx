import { Link } from "react-router-dom";
import {
  FaSearch,
  FaUserCircle,
  FaSignOutAlt,
  FaHeadset,
  FaCommentDots,
  FaRegCommentAlt,
  FaBell,
} from "react-icons/fa";
import { useState } from "react";

export default function Header() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // 🔔 Example: later you can fetch this from backend
  const [hasNewAnnouncement, setHasNewAnnouncement] = useState(true);

  return (
    <>
      <header className="w-full bg-accent h-[100px] text-white shadow-lg px-6 fixed top-0 left-0 z-40">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <img
              src="/logor.png"
              alt="ITGuru Logo"
              className="h-[90px] w-[90px] object-cover rounded-full"
            />
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-lg font-medium">
            <Link to="/" className="hover:text-gray-200">
              Home
            </Link>
            <Link to="/enrollment" className="hover:text-gray-200">
              Learning Materials
            </Link>
            <Link to="/performance" className="hover:text-gray-200">
              Performance
            </Link>
            <Link to="/student/viewTimetable" className="hover:text-gray-200">
              Time Table
            </Link>
            <Link to="/quizzes" className="hover:text-gray-200">
              Quizzes
            </Link>
            <Link to="/aboutus" className="hover:text-gray-200">
              About Us
            </Link>
          </nav>

          {/* Right Section (Search + Announcement + Profile) */}
          <div className="flex items-center gap-6">
            {/* Search Bar */}
            <div className="hidden md:flex items-center bg-white/20 rounded-full px-3 py-1">
              <FaSearch className="text-white mr-2" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent text-white placeholder-gray-200 focus:outline-none w-[150px]"
              />
            </div>

            {/* 🔔 Announcement Icon with Tick/Badge */}
            <div className="relative">
              <Link to="/announcement" className="text-2xl hover:text-gray-200">
                <FaBell />
              </Link>
              {hasNewAnnouncement && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border border-white"></span>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center"
              >
                <FaUserCircle className="text-3xl hover:text-gray-200" />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg overflow-hidden z-50">
                  <Link
                    to="/profile"
                    className="flex items-center px-4 py-2 hover:bg-gray-100"
                  >
                    <FaUserCircle className="mr-2" /> Profile
                  </Link>
                  <Link
                    to="/support"
                    className="flex items-center px-4 py-2 hover:bg-gray-100"
                  >
                    <FaHeadset className="mr-2" /> Support Ticket
                  </Link>
                  <button className="w-full flex items-center px-4 py-2 hover:bg-gray-100 text-left">
                    <FaSignOutAlt className="mr-2" /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden mt-2 flex flex-wrap gap-4 justify-center text-sm pb-2">
          <Link to="/" className="hover:text-gray-200">
            Home
          </Link>
          <Link to="/enrollment" className="hover:text-gray-200">
            Learning
          </Link>
          <Link to="/performance" className="hover:text-gray-200">
            Performance
          </Link>
          <Link to="/timetable" className="hover:text-gray-200">
            Time Table
          </Link>
          <Link to="/quizzes" className="hover:text-gray-200">
            Quizzes
          </Link>
          <Link to="/aboutus" className="hover:text-gray-200">
            About Us
          </Link>
        </div>
      </header>

      {/* Floating Action Buttons (Feedback, Support, Chatbot) */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-4 z-50">
        <Link
          to="/feedback"
          className="w-14 h-14 flex items-center justify-center rounded-full bg-accent shadow-lg hover:scale-105 transition"
          title="Give Feedback"
        >
          <FaRegCommentAlt className="text-2xl text-white" />
        </Link>
        <Link
          to="/support"
          className="w-14 h-14 flex items-center justify-center rounded-full bg-accent shadow-lg hover:scale-105 transition"
          title="Support Ticket"
        >
          <FaHeadset className="text-2xl text-white" />
        </Link>
        <button
          className="w-14 h-14 flex items-center justify-center rounded-full bg-accent shadow-lg hover:scale-105 transition"
          title="Chatbot"
        >
          <FaCommentDots className="text-2xl text-white" />
        </button>
      </div>
    </>
  );
}

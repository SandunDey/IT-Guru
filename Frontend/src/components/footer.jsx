import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-accent text-white mt-12">
      <div className="max-w-7xl mx-auto py-12 px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* About Section */}
        <div>
          <h2 className="text-2xl font-bold mb-4">ITGuru</h2>
          <p className="text-gray-200">
            Empowering students with the best IT knowledge and learning
            resources. Join us to enhance your skills and achieve success in
            your IT journey.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/" className="hover:text-gray-300 transition">
                Home
              </Link>
            </li>
            <li>
              <Link to="/materials" className="hover:text-gray-300 transition">
                Learning Materials
              </Link>
            </li>
            <li>
              <Link
                to="/performance"
                className="hover:text-gray-300 transition"
              >
                Performance
              </Link>
            </li>
            <li>
              <Link to="/timetable" className="hover:text-gray-300 transition">
                Time Table
              </Link>
            </li>
            <li>
              <Link to="/quizzes" className="hover:text-gray-300 transition">
                Quizzes
              </Link>
            </li>
            <li>
              <Link to="/aboutus" className="hover:text-gray-300 transition">
                About Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
          <ul className="space-y-3 text-gray-200">
            <li className="flex items-center gap-2">
              <FaMapMarkerAlt /> 123 IT Street, Colombo, Sri Lanka
            </li>
            <li className="flex items-center gap-2">
              <FaPhoneAlt /> +94 77 123 4567
            </li>
            <li className="flex items-center gap-2">
              <FaEnvelope /> info@itguru.com
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
          <div className="flex gap-4">
            <a
              href="#"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition"
            >
              <FaFacebookF />
            </a>
            <a
              href="#"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition"
            >
              <FaTwitter />
            </a>
            <a
              href="#"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition"
            >
              <FaInstagram />
            </a>
            <a
              href="#"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition"
            >
              <FaLinkedinIn />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/20 py-4 text-center text-gray-300 text-sm">
        &copy; {new Date().getFullYear()} ITGuru. All rights reserved.
      </div>
    </footer>
  );
}

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
    <footer className="bg-gradient-to-br from-blue-800 to-blue-900 text-white mt-12 rounded-t-2xl shadow-inner">
      <div className="max-w-7xl mx-auto py-12 px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* About Section */}
        <div>
          <h2 className="text-2xl font-bold mb-4">ITGuru</h2>
          <p className="text-blue-100 text-sm leading-relaxed">
            Empowering students with the best IT knowledge and learning
            resources. Join us to enhance your skills and achieve success in
            your IT journey.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-blue-300 transition">Home</Link></li>
            <li><Link to="/materials" className="hover:text-blue-300 transition">Learning Materials</Link></li>
            <li><Link to="/performance" className="hover:text-blue-300 transition">Performance</Link></li>
            <li><Link to="/timetable" className="hover:text-blue-300 transition">Time Table</Link></li>
            <li><Link to="/quizzes" className="hover:text-blue-300 transition">Quizzes</Link></li>
            <li><Link to="/aboutus" className="hover:text-blue-300 transition">About Us</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
          <ul className="space-y-3 text-blue-100 text-sm">
            <li className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-blue-400" /> 123 IT Street, Colombo, Sri Lanka
            </li>
            <li className="flex items-center gap-2">
              <FaPhoneAlt className="text-blue-400" /> +94 77 123 4567
            </li>
            <li className="flex items-center gap-2">
              <FaEnvelope className="text-blue-400" /> info@itguru.com
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
          <div className="flex gap-4">
            {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition"
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/20 py-4 text-center text-blue-200 text-sm">
        &copy; {new Date().getFullYear()} ITGuru. All rights reserved.
      </div>
    </footer>
  );
}
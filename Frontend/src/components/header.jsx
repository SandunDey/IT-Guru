import React, { useState } from 'react';
import { BookOpenIcon, MenuIcon, XIcon } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import Logo from "../assets/logo.jpg";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate(); // <-- ADD THIS

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
           
                  <img
                                     src={Logo}
                                     alt="IT Guru Logo"
                                     className="h-16 w-16 rounded-full object-cover shadow-lg"
                                   />
              ITGURU
            
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="/" className="text-gray-600 hover:text-blue-600 font-medium">
              Home
            </a>
            <a href="#" className="text-gray-600 hover:text-blue-600 font-medium">
              Classes
            </a>
            <a href="/announcement" className="text-gray-600 hover:text-blue-600 font-medium">
              Announcement
            </a>
             {/* <a href="#" className="text-gray-600 hover:text-blue-600 font-medium">
              Pricing
            </a> */}
             <a href="/contactus" className="text-gray-600 hover:text-blue-600 font-medium">
              Contact
            </a> 
            <a href="/aboutus" className="text-gray-600 hover:text-blue-600 font-medium">
              About Us
            </a>
            {/* ✅ Navigate to /signup */}
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300"
              onClick={() => navigate("/admin")}
            >
              Sign Up
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={toggleMenu} className="text-gray-600 hover:text-blue-600">
              {isMenuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a href="/" className="block px-3 py-2 text-gray-600 hover:text-blue-600 font-medium">
              Home
            </a>
            <a href="#" className="block px-3 py-2 text-gray-600 hover:text-blue-600 font-medium">
              Classes
            </a>
            <a href="/announcement" className="block px-3 py-2 text-gray-600 hover:text-blue-600 font-medium">
              Announcement
            </a>
            <a href="#" className="block px-3 py-2 text-gray-600 hover:text-blue-600 font-medium">
              Pricing
            </a>
            <a href="#" className="block px-3 py-2 text-gray-600 hover:text-blue-600 font-medium">
              Contact
            </a>
            {/* ✅ Navigate to /signup (mobile) */}
            <button
              onClick={() => {
                setIsMenuOpen(false); // menu close wenawa
                navigate("/login");
              }}
              className="w-full text-left bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 transition duration-300"
            >
              Sign Up
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

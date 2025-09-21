import React from 'react';
import { Link } from 'react-router-dom';

const HelpCenterPage = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Blue Header Section inspired by the image */}
      <div className="bg-blue-700 p-8 sm:p-16 text-center text-white shadow-lg">
        <h1 className="text-4xl font-bold mb-4">How can we help you today?</h1>
        <div className="mt-6 flex justify-center">
            <input 
              type="search" 
              placeholder="Search..."
              className="w-full max-w-2xl p-4 rounded-full text-gray-800 border-2 border-transparent focus:outline-none focus:border-blue-300"
            />
        </div>
      </div>

      {/*  Navigation Cards Section  */}
      <div className="max-w-5xl mx-auto p-4 sm:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <Link to="/submit-ticket" className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Submit a Ticket</h2>
            <p className="text-gray-600">Got a problem? Create a new support ticket and our team will get back to you.</p>
          </Link>

          <Link to="/my-tickets" className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center">
            <h2 className="text-xl font-bold text-gray-800 mb-2">My Tickets</h2>
            <p className="text-gray-600">Check the status and history of the tickets you have submitted.</p>
          </Link>

          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Knowledgebase</h2>
            <p className="text-gray-600">Browse articles and find answers to frequently asked questions.</p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default HelpCenterPage;
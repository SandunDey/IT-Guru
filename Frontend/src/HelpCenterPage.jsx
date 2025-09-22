import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const HelpCenterPage = () => {
  const navigate = useNavigate();

  const handleSupportClick = () => {
    const auth = localStorage.getItem('app_auth');
    if (!auth) {
      // Redirect to /admin (login page) instead of /login
      navigate('/admin');
    } else {
      navigate('/submit-ticket');
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Help Center</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Get Support</h2>
            <p className="text-gray-600 mb-4">
              Having issues with your course, payments, or technical problems? 
              Submit a support ticket and our team will help you.
            </p>
            <button 
              onClick={handleSupportClick}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 w-full"
            >
              Get Support
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">View My Tickets</h2>
            <p className="text-gray-600 mb-4">
              Check the status of your existing support tickets and communicate with our support team.
            </p>
            <button 
              onClick={() => {
                const auth = localStorage.getItem('app_auth');
                if (!auth) {
                  navigate('/admin');
                } else {
                  navigate('/my-tickets');
                }
              }}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 w-full"
            >
              View My Tickets
            </button>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-12 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div className="border-b pb-4">
              <h3 className="font-semibold text-lg">How long does it take to get a response?</h3>
              <p className="text-gray-600">We typically respond within 24-48 hours during business days.</p>
            </div>
            <div className="border-b pb-4">
              <h3 className="font-semibold text-lg">Can I update my ticket after submission?</h3>
              <p className="text-gray-600">Yes, you can view and update your tickets from the "My Tickets" section.</p>
            </div>
            <div className="border-b pb-4">
              <h3 className="font-semibold text-lg">What information should I include?</h3>
              <p className="text-gray-600">Please include your registration number, course details, and a clear description of the issue.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenterPage;
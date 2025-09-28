import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SubmitTicketPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    registrationNumber: '',
    contactNumber: '',
    courseOrExamYear: '',
    subject: '',
    message: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const auth = localStorage.getItem('app_auth');
    if (!auth) {
      navigate('/admin'); // Redirect to /admin (login) if not logged in
      return;
    }

    // Auto-fill user data from localStorage
    try {
      const userData = JSON.parse(auth);
      if (userData.user) {
        setFormData(prev => ({
          ...prev,
          email: userData.user.email || '',
          name: userData.user.name || prev.name
        }));
      }
    } catch (error) {
      console.error('Error parsing auth data:', error);
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Prevent changing email if user is logged in
    const auth = localStorage.getItem('app_auth');
    if (name === 'email' && auth) {
      return; // Don't allow changing email
    }
    
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await axios.post('/api/tickets', formData);
      navigate('/my-tickets');
    } catch (err) {
      setError('Failed to submit ticket. Please check all fields.');
    }
    setIsLoading(false);
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Submit a Support Ticket</h1>
        
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md mb-8">
          <p className="mb-4 text-gray-600">Please complete this form and one of our agents will reply to you by email as soon as possible.</p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name *</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleInputChange} 
                  required 
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email *</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleInputChange} 
                  required 
                  disabled={!!localStorage.getItem('app_auth')}
                  className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                    localStorage.getItem('app_auth') ? 'bg-gray-100 cursor-not-allowed' : ''
                  }`}
                />
                {localStorage.getItem('app_auth') && (
                  <p className="text-xs text-gray-500 mt-1">Email is auto-filled from your account</p>
                )}
              </div>
              <div>
                <label htmlFor="registrationNumber" className="block text-sm font-medium text-gray-700">Registration Number *</label>
                <input 
                  type="text" 
                  id="registrationNumber" 
                  name="registrationNumber" 
                  value={formData.registrationNumber} 
                  onChange={handleInputChange} 
                  required 
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700">Contact Number *</label>
                <input 
                  type="tel" 
                  id="contactNumber" 
                  name="contactNumber" 
                  value={formData.contactNumber} 
                  onChange={handleInputChange} 
                  required 
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="courseOrExamYear" className="block text-sm font-medium text-gray-700">Course or Exam Year *</label>
                <input 
                  type="text" 
                  id="courseOrExamYear" 
                  name="courseOrExamYear" 
                  value={formData.courseOrExamYear} 
                  onChange={handleInputChange} 
                  required 
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject *</label>
                <input 
                  type="text" 
                  id="subject" 
                  name="subject" 
                  value={formData.subject} 
                  onChange={handleInputChange} 
                  required 
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message *</label>
              <textarea 
                id="message" 
                name="message" 
                value={formData.message} 
                onChange={handleInputChange} 
                required 
                rows="5" 
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              ></textarea>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                type="submit" 
                disabled={isLoading}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
              >
                {isLoading ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </form>
        </div>
        {error && <p className="text-red-500 text-center font-semibold">{error}</p>}
      </div>
    </div>
  );
};

export default SubmitTicketPage;
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

// Token helper utility
const getToken = () => {
  let token = localStorage.getItem('itguru_token');
  if (!token) {
    token = sessionStorage.getItem('itguru_token');
  }
  return token;
};

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
  const [authError, setAuthError] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setAuthError(false);

    try {
      const token = getToken();
      if (!token) {
        setAuthError(true);
        setError('Please log in to submit a ticket.');
        setIsLoading(false);
        return;
      }

      const response = await axios.post('/api/tickets', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      // On success, navigate to the "My Tickets" page to view the submitted ticket
      navigate('/my-tickets');
    } catch (err) {
      if (err.response?.status === 401) {
        setAuthError(true);
        setError('Please log in to submit a ticket.');
      } else if (err.response?.status === 403) {
        setError('You can only create tickets with your own email address.');
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to submit ticket. Please check all fields.');
      }
      console.error('Error submitting ticket:', err);
    }
    setIsLoading(false);
  };

  // Show authentication required message
  if (authError) {
    return (
      <div className="bg-gray-100 min-h-screen p-4 sm:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Authentication Required</h1>
            <p className="text-gray-600 text-lg mb-6">Please log in to submit a support ticket.</p>
            <Link
              to="/login"
              className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 inline-block"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Submit a Support Ticket</h1>
        
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md mb-8">
          <p className="mb-4 text-gray-600">Please complete this form and one of our agents will reply to you by email as soon as possible.</p>
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
              <p className="text-red-700 font-semibold">{error}</p>
            </div>
          )}

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
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                <p className="mt-1 text-sm text-gray-500">Must match your logged-in account email</p>
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
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Add attachment</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="flex text-sm text-gray-600">
                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                      <span>Choose files</span>
                      <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple/>
                    </label>
                    <p className="pl-1">or Drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button 
                type="submit" 
                disabled={isLoading} 
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Submitting...' : 'Submit Ticket'}
              </button>
              
              <Link 
                to="/my-tickets" 
                className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                View My Tickets
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SubmitTicketPage;
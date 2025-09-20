import React, { useState } from 'react';
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post('/api/tickets', formData);
      // On success, navigate to the "My Tickets" page to view the submitted ticket
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
              {/* Form fields: Name, Email, Reg Number, etc. */}
              {/* This JSX is exactly the same as the form in your previous code */}
              <div><label htmlFor="name" className="block text-sm font-medium text-gray-700">Name *</label><input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/></div>
              <div><label htmlFor="email" className="block text-sm font-medium text-gray-700">Email *</label><input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/></div>
              <div><label htmlFor="registrationNumber" className="block text-sm font-medium text-gray-700">Registration Number *</label><input type="text" id="registrationNumber" name="registrationNumber" value={formData.registrationNumber} onChange={handleInputChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/></div>
              <div><label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700">Contact Number *</label><input type="tel" id="contactNumber" name="contactNumber" value={formData.contactNumber} onChange={handleInputChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/></div>
              <div><label htmlFor="courseOrExamYear" className="block text-sm font-medium text-gray-700">Course or Exam Year *</label><input type="text" id="courseOrExamYear" name="courseOrExamYear" value={formData.courseOrExamYear} onChange={handleInputChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/></div>
              <div><label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject *</label><input type="text" id="subject" name="subject" value={formData.subject} onChange={handleInputChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/></div>
            </div>
            <div><label htmlFor="message" className="block text-sm font-medium text-gray-700">Message *</label><textarea id="message" name="message" value={formData.message} onChange={handleInputChange} required rows="5" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"></textarea></div>
            <div><label className="block text-sm font-medium text-gray-700">Add attachment</label><div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md"><div className="space-y-1 text-center"><svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg><div className="flex text-sm text-gray-600"><label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"><span>Choose files</span><input id="file-upload" name="file-upload" type="file" className="sr-only" multiple/></label><p className="pl-1">or Drag and drop</p></div><p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p></div></div></div>
            <div className="flex items-center space-x-4"><button type="submit" disabled={isLoading} className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400">{isLoading ? 'Submitting...' : 'Submit'}</button></div>
          </form>
        </div>
        {error && <p className="text-red-500 text-center font-semibold">{error}</p>}
      </div>
    </div>
  );
};

export default SubmitTicketPage;
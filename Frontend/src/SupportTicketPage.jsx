import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SupportTicketPage = () => {
  const [tickets, setTickets] = useState([]);
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
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [ticketToClose, setTicketToClose] = useState(null);

  useEffect(() => {
    const fetchTickets = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('/api/tickets');
        setTickets(response.data);
      } catch (err) {
        setError('Failed to fetch tickets.');
      }
      setIsLoading(false);
    };
    fetchTickets();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      // Form එකේ data ටික backend එකට යවනවා
      const response = await axios.post('/api/tickets', formData);
      setTickets([...tickets, response.data.ticket]);
      // Form එක clear කරනවා
      setFormData({ name: '', email: '', registrationNumber: '', contactNumber: '', courseOrExamYear: '', subject: '', message: '' });
    } catch (err) {
      setError('Failed to submit ticket. Please check all fields.');
    }
    setIsLoading(false);
  };
  
  const promptCloseTicket = (ticket) => {
    setTicketToClose(ticket);
    setShowConfirmModal(true);
  };
  
  const handleConfirmClose = async () => {
    if (!ticketToClose) return;
    setIsLoading(true);
    try {
      const response = await axios.put(`/api/tickets/${ticketToClose._id}`, { status: 'Closed' });
      setTickets(tickets.map(t => (t._id === ticketToClose._id ? response.data.ticket : t)));
    } catch (err) {
      setError('Failed to close ticket.');
    }
    setIsLoading(false);
    setShowConfirmModal(false);
    setTicketToClose(null);
  };

  const getBadgeClass = (value) => {
    const baseClass = "px-3 py-1 text-xs font-semibold text-white rounded-full";
    switch (value) {
      case 'Open': return `${baseClass} bg-green-500`;
      case 'In Progress': return `${baseClass} bg-yellow-500 text-black`;
      case 'Resolved': return `${baseClass} bg-blue-500`;
      default: return `${baseClass} bg-gray-500`;
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Submit a Support Ticket</h1>
        
        {/* New Ticket Creation Form */}
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md mb-8">
          <p className="mb-4 text-gray-600">Please complete this form and one of our agents will reply to you by email as soon as possible.</p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name *</label>
                <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email *</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
              </div>
              <div>
                <label htmlFor="registrationNumber" className="block text-sm font-medium text-gray-700">Registration Number *</label>
                <input type="text" id="registrationNumber" name="registrationNumber" value={formData.registrationNumber} onChange={handleInputChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
              </div>
              <div>
                <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700">Contact Number *</label>
                <input type="tel" id="contactNumber" name="contactNumber" value={formData.contactNumber} onChange={handleInputChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
              </div>
              <div>
                <label htmlFor="courseOrExamYear" className="block text-sm font-medium text-gray-700">Course or Exam Year *</label>
                <input type="text" id="courseOrExamYear" name="courseOrExamYear" value={formData.courseOrExamYear} onChange={handleInputChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject *</label>
                <input type="text" id="subject" name="subject" value={formData.subject} onChange={handleInputChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
              </div>
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message *</label>
              <textarea id="message" name="message" value={formData.message} onChange={handleInputChange} required rows="5" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"></textarea>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Add attachment</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        <div className="flex text-sm text-gray-600"><label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"><span>Choose files</span><input id="file-upload" name="file-upload" type="file" className="sr-only" multiple/></label><p className="pl-1">or Drag and drop</p></div>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    </div>
                </div>
            </div>
            <div className="flex items-center space-x-4">
              <button type="submit" disabled={isLoading} className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400">
                {isLoading ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </form>
        </div>

        {/* My Tickets List */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-4">My Submitted Tickets</h2>
          {isLoading && tickets.length === 0 && <p>Loading tickets...</p>}
          {error && <p className="text-red-500 font-semibold">{error}</p>}
          <div className="space-y-4">
            {tickets.map(ticket => (
              <div key={ticket._id} className="bg-white p-5 rounded-lg shadow-md">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-bold text-gray-900">{ticket.subject}</h3>
                  <span className={getBadgeClass(ticket.status)}>{ticket.status}</span>
                </div>
                <p className="text-gray-600 mt-2 whitespace-pre-wrap">{ticket.message}</p>
                <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                    <span className="text-sm text-gray-500">Submitted on: {new Date(ticket.createdAt).toLocaleDateString()}</span>
                    <div className="space-x-2">
                        {/* Student ට Edit කරන්න බෑ. Close විතරයි කරන්න පුළුවන්. */}
                        {!['Resolved', 'Closed'].includes(ticket.status) && (
                            <button onClick={() => promptCloseTicket(ticket)} className="py-1 px-3 text-sm font-medium text-red-600 bg-red-100 rounded-md hover:bg-red-200">
                              Close Ticket
                            </button>
                        )}
                        {ticket.status === 'Resolved' && (
                            <span className="py-1 px-3 text-sm font-medium text-white bg-green-600 rounded-md">✓ Resolved by Staff</span>
                        )}
                    </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Confirmation Modal */}
        {showConfirmModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
              <h2 className="text-xl font-bold mb-4">Are you sure?</h2>
              <p className="text-gray-600 mb-6">You are about to close this ticket yourself. This action cannot be undone.</p>
              <div className="flex justify-end space-x-4">
                <button onClick={() => setShowConfirmModal(false)} className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">Cancel</button>
                <button onClick={handleConfirmClose} className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700">Yes, Close My Ticket</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupportTicketPage;
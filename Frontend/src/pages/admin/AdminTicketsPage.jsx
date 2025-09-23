// File: src/admin/AdminTicketsPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const AdminTicketsPage = () => {
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [status, setStatus] = useState('Open');
  const [staffName, setStaffName] = useState('');

  useEffect(() => {
    fetchAllTickets();
  }, []);

  const fetchAllTickets = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('/api/tickets');
      setTickets(response.data);
    } catch (err) {
      setError('Failed to fetch tickets.');
      console.error('Error fetching tickets:', err);
    }
    setIsLoading(false);
  };

  const handleTicketSelect = (ticket) => {
    setSelectedTicket(ticket);
    setStatus(ticket.status);
    setReplyText('');
    setStaffName('');
  };

  const handleSubmitReply = async () => {
    if (!selectedTicket || !replyText.trim() || !staffName.trim()) return;

    try {
      const response = await axios.put(`/api/tickets/${selectedTicket._id}`, {
        reply: replyText,
        repliedBy: staffName,
        status: status
      });

      setTickets(tickets.map(t => 
        t._id === selectedTicket._id ? response.data.ticket : t
      ));
      
      setSelectedTicket(response.data.ticket);
      setReplyText('');
      setStaffName('');
      
      alert('Reply submitted successfully!');
    } catch (err) {
      console.error('Error submitting reply:', err);
      setError('Failed to submit reply.');
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      'Open': 'bg-green-100 text-green-800',
      'In Progress': 'bg-yellow-100 text-yellow-800',
      'Resolved': 'bg-blue-100 text-blue-800',
      'Closed': 'bg-gray-100 text-gray-800'
    };
    return `px-2 py-1 text-xs font-medium rounded-full ${statusClasses[status]}`;
  };

  if (isLoading) return <div className="p-8">Loading tickets...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Support Ticket Management</h1>
              <p className="text-gray-600">Manage all student support tickets</p>
            </div>
            <Link 
              to="/admin" 
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition duration-200"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tickets List */}
          <div className="lg:col-span-1 bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">All Tickets ({tickets.length})</h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {tickets.map(ticket => (
                <div
                  key={ticket._id}
                  className={`p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                    selectedTicket?._id === ticket._id ? 'bg-blue-50 border-blue-300' : 'border-gray-200'
                  }`}
                  onClick={() => handleTicketSelect(ticket)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800">{ticket.subject}</h3>
                      <p className="text-sm text-gray-600 truncate">{ticket.message}</p>
                    </div>
                    <span className={getStatusBadge(ticket.status)}>
                      {ticket.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-gray-500">{ticket.name}</span>
                    <span className="text-xs text-gray-500">
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ticket Details and Reply */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
            {selectedTicket ? (
              <>
                <div className="border-b pb-4 mb-4">
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-xl font-bold text-gray-800">{selectedTicket.subject}</h2>
                    <span className={getStatusBadge(selectedTicket.status)}>
                      {selectedTicket.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>From:</strong> {selectedTicket.name} ({selectedTicket.email})
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Registered:</strong> {selectedTicket.registrationNumber}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Contact:</strong> {selectedTicket.contactNumber}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Course/Year:</strong> {selectedTicket.courseOrExamYear}
                  </p>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold text-gray-800 mb-2">Message:</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700 whitespace-pre-wrap">{selectedTicket.message}</p>
                  </div>
                </div>

                {/* Staff Replies Section */}
                {selectedTicket.replies && selectedTicket.replies.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-800 mb-3">Staff Replies:</h3>
                    {selectedTicket.replies.map((reply, index) => (
                      <div key={index} className="bg-blue-50 p-4 rounded-lg mb-3">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-medium text-blue-800">{reply.repliedBy}</span>
                          <span className="text-sm text-blue-600">
                            {new Date(reply.repliedAt).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-blue-700 whitespace-pre-wrap">{reply.text}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Reply Form */}
                <div className="border-t pt-4">
                  <h3 className="font-semibold text-gray-800 mb-3">Reply to Ticket:</h3>
                  
                  <div className="mb-3">
                    <input
                      type="text"
                      value={staffName}
                      onChange={(e) => setStaffName(e.target.value)}
                      placeholder="Your Name"
                      className="w-full p-2 border border-gray-300 rounded-lg mb-2"
                    />
                  </div>
                  
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your reply here..."
                    rows="4"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  
                  <div className="flex items-center space-x-4 mt-3">
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="Open">Open</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                      <option value="Closed">Closed</option>
                    </select>
                    
                    <button
                      onClick={handleSubmitReply}
                      disabled={!replyText.trim() || !staffName.trim()}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      Submit Reply
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center text-gray-500 py-12">
                <p>Select a ticket from the list to view details and reply</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminTicketsPage;
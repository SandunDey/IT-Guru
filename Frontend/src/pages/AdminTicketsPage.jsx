import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminTicketsPage = () => {
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [isReplying, setIsReplying] = useState(false);
  const [filterStatus, setFilterStatus] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is admin
    const checkAdminAuth = () => {
      const auth = localStorage.getItem('app_auth');
      if (!auth) {
        navigate('/admin');
        return false;
      }
      
      try {
        const authData = JSON.parse(auth);
        if (authData.user?.role !== 'admin') {
          navigate('/admin');
          return false;
        }
        return authData;
      } catch (error) {
        navigate('/admin');
        return false;
      }
    };

    if (!checkAdminAuth()) return;

    fetchAllTickets();
  }, [navigate]);

  const fetchAllTickets = async () => {
    setIsLoading(true);
    try {
      const auth = localStorage.getItem('app_auth');
      const authData = JSON.parse(auth);
      const token = authData.token;

      const response = await axios.get('/api/tickets', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTickets(response.data);
    } catch (err) {
      console.error('Error fetching tickets:', err);
      if (err.response?.status === 401) {
        localStorage.removeItem('app_auth');
        navigate('/admin');
      } else {
        setError('Failed to fetch tickets.');
      }
    }
    setIsLoading(false);
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedTicket) return;

    setIsReplying(true);
    try {
      const auth = localStorage.getItem('app_auth');
      const authData = JSON.parse(auth);
      const token = authData.token;

      await axios.put(`/api/tickets/${selectedTicket._id}`, {
        reply: replyText,
        repliedBy: authData.user.name || 'Admin',
        status: 'In Progress' // Automatically set status to In Progress when replying
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Refresh tickets
      await fetchAllTickets();
      setReplyText('');
      setSelectedTicket(null);
      alert('Reply sent successfully!');
    } catch (err) {
      console.error('Error sending reply:', err);
      alert('Failed to send reply.');
    }
    setIsReplying(false);
  };

  const updateTicketStatus = async (ticketId, newStatus) => {
    try {
      const auth = localStorage.getItem('app_auth');
      const authData = JSON.parse(auth);
      const token = authData.token;

      await axios.put(`/api/tickets/${ticketId}`, {
        status: newStatus
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      await fetchAllTickets();
      alert('Status updated successfully!');
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update status.');
    }
  };

  const getBadgeClass = (status) => {
    const baseClass = "px-3 py-1 text-xs font-semibold rounded-full";
    switch (status) {
      case 'Open': return `${baseClass} bg-green-100 text-green-800`;
      case 'In Progress': return `${baseClass} bg-yellow-100 text-yellow-800`;
      case 'Resolved': return `${baseClass} bg-blue-100 text-blue-800`;
      case 'Closed': return `${baseClass} bg-gray-100 text-gray-800`;
      default: return `${baseClass} bg-gray-100 text-gray-800`;
    }
  };

  const getPriorityBadge = (priority) => {
    const baseClass = "px-2 py-1 text-xs font-semibold rounded";
    switch (priority) {
      case 'High': return `${baseClass} bg-red-100 text-red-800`;
      case 'Medium': return `${baseClass} bg-orange-100 text-orange-800`;
      case 'Low': return `${baseClass} bg-green-100 text-green-800`;
      default: return `${baseClass} bg-gray-100 text-gray-800`;
    }
  };

  const filteredTickets = filterStatus === 'All' 
    ? tickets 
    : tickets.filter(ticket => ticket.status === filterStatus);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading tickets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Support Tickets Management</h1>
          <p className="text-gray-600 mt-2">Manage all customer support tickets</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow mb-6 p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="All">All Tickets</option>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
            <div className="text-sm text-gray-600">
              Showing {filteredTickets.length} of {tickets.length} tickets
            </div>
          </div>
        </div>

        {/* Tickets Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tickets List */}
          <div className="lg:col-span-2 space-y-4">
            {filteredTickets.map(ticket => (
              <div 
                key={ticket._id} 
                className={`bg-white rounded-lg shadow border-l-4 ${
                  ticket.status === 'Open' ? 'border-l-green-500' :
                  ticket.status === 'In Progress' ? 'border-l-yellow-500' :
                  ticket.status === 'Resolved' ? 'border-l-blue-500' :
                  'border-l-gray-500'
                } hover:shadow-md transition-shadow cursor-pointer`}
                onClick={() => setSelectedTicket(ticket)}
              >
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900 text-lg">{ticket.subject}</h3>
                    <div className="flex gap-2">
                      <span className={getBadgeClass(ticket.status)}>{ticket.status}</span>
                      <span className={getPriorityBadge(ticket.priority)}>
                        {ticket.priority || 'Medium'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                    <div>
                      <span className="font-medium">By:</span> {ticket.name}
                    </div>
                    <div>
                      <span className="font-medium">Ref:</span> {ticket.referenceCode}
                    </div>
                    <div>
                      <span className="font-medium">Email:</span> {ticket.email}
                    </div>
                    <div>
                      <span className="font-medium">Reg No:</span> {ticket.registrationNumber}
                    </div>
                  </div>

                  <p className="text-gray-700 line-clamp-2 mb-3">{ticket.message}</p>
                  
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>Created: {new Date(ticket.createdAt).toLocaleDateString()}</span>
                    <span>{ticket.replies?.length || 0} replies</span>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTicket(ticket);
                      }}
                      className="text-xs bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700"
                    >
                      Reply
                    </button>
                    {ticket.status !== 'Resolved' && ticket.status !== 'Closed' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateTicketStatus(ticket._id, 'Resolved');
                        }}
                        className="text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                      >
                        Mark Resolved
                      </button>
                    )}
                    {ticket.status !== 'Closed' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateTicketStatus(ticket._id, 'Closed');
                        }}
                        className="text-xs bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700"
                      >
                        Close
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {filteredTickets.length === 0 && (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <p className="text-gray-500 text-lg">No tickets found.</p>
              </div>
            )}
          </div>

          {/* Reply Sidebar */}
          <div className="lg:col-span-1">
            {selectedTicket ? (
              <div className="bg-white rounded-lg shadow p-6 sticky top-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-lg">Reply to Ticket</h3>
                  <button
                    onClick={() => setSelectedTicket(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>

                <div className="mb-4 p-3 bg-gray-50 rounded">
                  <p className="font-medium">{selectedTicket.subject}</p>
                  <p className="text-sm text-gray-600 mt-1">{selectedTicket.message}</p>
                </div>

                <form onSubmit={handleReplySubmit}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Reply
                    </label>
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      rows="6"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Type your reply here..."
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isReplying}
                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:bg-indigo-300"
                  >
                    {isReplying ? 'Sending...' : 'Send Reply'}
                  </button>
                </form>

                {/* Previous Replies */}
                {selectedTicket.replies && selectedTicket.replies.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-medium text-gray-700 mb-3">Previous Replies</h4>
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {selectedTicket.replies.map((reply, index) => (
                        <div key={index} className="bg-blue-50 p-3 rounded">
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-medium text-sm">{reply.repliedBy}</span>
                            <span className="text-xs text-gray-500">
                              {new Date(reply.repliedAt).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700">{reply.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <p className="text-gray-500">Select a ticket to view details and reply</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminTicketsPage;
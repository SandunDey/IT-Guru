// src/pages/TempAdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MessageSquare, Search, Filter, RefreshCw, User, Mail, Calendar } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

export default function TempAdminDashboard() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');

  // සියලු tickets load කිරීම
  const loadTickets = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/api/tickets`);
      setTickets(response.data);
      setError('');
    } catch (err) {
      setError('Tickets load කිරීමට නොහැකි විය');
      console.error('Error loading tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  // Ticket එකට reply දීම
  const handleReply = async (ticketId) => {
    if (!replyMessage.trim()) {
      alert('Reply message ඇතුලත් කරන්න');
      return;
    }

    try {
      const response = await axios.put(`${API_BASE}/api/tickets/${ticketId}`, {
        reply: replyMessage,
        repliedBy: 'Temporary Admin',
        status: 'In Progress'
      });

      if (response.data.ticket) {
        // Updated ticket එක list එකට add කිරීම
        setTickets(prev => prev.map(ticket => 
          ticket._id === ticketId ? response.data.ticket : ticket
        ));
        
        setReplyingTo(null);
        setReplyMessage('');
        alert('Reply successfully added!');
      }
    } catch (err) {
      alert('Reply දීමට නොහැකි විය');
      console.error('Error replying:', err);
    }
  };

  // Ticket status change කිරීම
  const updateStatus = async (ticketId, newStatus) => {
    try {
      const response = await axios.put(`${API_BASE}/api/tickets/${ticketId}`, {
        status: newStatus
      });

      if (response.data.ticket) {
        setTickets(prev => prev.map(ticket => 
          ticket._id === ticketId ? response.data.ticket : ticket
        ));
      }
    } catch (err) {
      alert('Status update කිරීමට නොහැකි විය');
      console.error('Error updating status:', err);
    }
  };

  // Component load වන විට tickets load කිරීම
  useEffect(() => {
    loadTickets();
  }, []);

  // Filtered tickets
  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = 
      ticket.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.referenceCode.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || ticket.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Status colors
  const statusColors = {
    'Open': 'bg-blue-100 text-blue-800',
    'In Progress': 'bg-yellow-100 text-yellow-800',
    'Resolved': 'bg-green-100 text-green-800',
    'Closed': 'bg-gray-100 text-gray-800'
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">🎛️ Temporary Admin Dashboard</h1>
              <p className="text-gray-600 mt-2">Support Tickets Management Panel</p>
            </div>
            <button
              onClick={loadTickets}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              <RefreshCw size={18} />
              Refresh
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{tickets.length}</div>
              <div className="text-blue-800">Total Tickets</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {tickets.filter(t => t.status === 'Resolved').length}
              </div>
              <div className="text-green-800">Resolved</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {tickets.filter(t => t.status === 'In Progress').length}
              </div>
              <div className="text-yellow-800">In Progress</div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {tickets.filter(t => t.status === 'Open').length}
              </div>
              <div className="text-red-800">Open</div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by name, email, subject..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Status</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Tickets List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading tickets...</p>
            </div>
          ) : filteredTickets.length === 0 ? (
            <div className="text-center py-8 bg-white rounded-2xl">
              <p className="text-gray-600">No tickets found</p>
            </div>
          ) : (
            filteredTickets.map((ticket) => (
              <div key={ticket._id} className="bg-white rounded-2xl shadow-sm p-6">
                {/* Ticket Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{ticket.subject}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[ticket.status]}`}>
                        {ticket.status}
                      </span>
                      <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                        {ticket.referenceCode}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <User size={16} />
                        {ticket.name}
                      </div>
                      <div className="flex items-center gap-1">
                        <Mail size={16} />
                        {ticket.email}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar size={16} />
                        {new Date(ticket.createdAt).toLocaleDateString()}
                      </div>
                      <div>
                        Course: {ticket.courseOrExamYear}
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <select
                      value={ticket.status}
                      onChange={(e) => updateStatus(ticket._id, e.target.value)}
                      className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
                    >
                      <option value="Open">Open</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                      <option value="Closed">Closed</option>
                    </select>
                    
                    <button
                      onClick={() => setReplyingTo(replyingTo === ticket._id ? null : ticket._id)}
                      className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-700"
                    >
                      <MessageSquare size={16} />
                      Reply
                    </button>
                  </div>
                </div>

                {/* Ticket Message */}
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <p className="text-gray-800 whitespace-pre-wrap">{ticket.message}</p>
                </div>

                {/* Existing Replies */}
                {ticket.replies && ticket.replies.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Replies:</h4>
                    {ticket.replies.map((reply, index) => (
                      <div key={index} className="bg-blue-50 p-3 rounded-lg mb-2">
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-semibold text-blue-800">{reply.repliedBy}</span>
                          <span className="text-sm text-blue-600">
                            {new Date(reply.repliedAt).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-blue-900">{reply.text}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Reply Form */}
                {replyingTo === ticket._id && (
                  <div className="border-t pt-4">
                    <textarea
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      placeholder="Type your reply here..."
                      rows="3"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => handleReply(ticket._id)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                      >
                        Send Reply
                      </button>
                      <button
                        onClick={() => {
                          setReplyingTo(null);
                          setReplyMessage('');
                        }}
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
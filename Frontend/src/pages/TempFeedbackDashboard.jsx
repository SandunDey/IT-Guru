// src/pages/TempFeedbackDashboard.jsx - FIXED VERSION
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Star, Search, Filter, RefreshCw, User, Mail, Calendar, MessageSquare, ThumbsUp } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

export default function TempFeedbackDashboard() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');

  // ✅ FIXED: සියලු feedbacks load කිරීම (public endpoint use කරයි)
  const loadFeedbacks = async () => {
    try {
      setLoading(true);
      setError('');
      
      // PUBLIC endpoint use කරයි - authentication නැතිව
      const response = await axios.get(`${API_BASE}/api/feedback/public/all`);
      
      // Different response formats handle කිරීම
      if (response.data.feedback) {
        setFeedbacks(response.data.feedback);
      } else if (Array.isArray(response.data)) {
        setFeedbacks(response.data);
      } else {
        setFeedbacks([]);
      }
      
    } catch (err) {
      console.error('Error loading feedbacks:', err);
      setError('Feedbacks load කිරීමට නොහැකි විය. Server check කරන්න.');
      
      // Fallback: Try direct endpoint
      try {
        const fallbackResponse = await axios.get(`${API_BASE}/api/feedback`);
        if (fallbackResponse.data.feedback) {
          setFeedbacks(fallbackResponse.data.feedback);
          setError('');
        }
      } catch (fallbackErr) {
        console.error('Fallback also failed:', fallbackErr);
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ FIXED: Feedback එකට admin reply දීම
  const handleAdminReply = async (feedbackId) => {
    if (!replyMessage.trim()) {
      alert('Reply message ඇතුලත් කරන්න');
      return;
    }

    try {
      // PUBLIC endpoint use කරයි
      const response = await axios.put(`${API_BASE}/api/feedback/public/${feedbackId}/reply`, {
        replyMessage: replyMessage,
        repliedBy: 'Temporary Admin'
      });

      if (response.data.feedback) {
        setFeedbacks(prev => prev.map(feedback => 
          feedback._id === feedbackId ? response.data.feedback : feedback
        ));
        
        setReplyingTo(null);
        setReplyMessage('');
        alert('Admin reply successfully added!');
      }
    } catch (err) {
      console.error('Error replying:', err);
      alert('Reply දීමට නොහැකි විය. Console එක check කරන්න.');
    }
  };

  // ✅ FIXED: Feedback status change කිරීම
  const updateStatus = async (feedbackId, newStatus) => {
    try {
      const response = await axios.put(`${API_BASE}/api/feedback/public/${feedbackId}/status`, {
        status: newStatus
      });

      if (response.data.feedback) {
        setFeedbacks(prev => prev.map(feedback => 
          feedback._id === feedbackId ? response.data.feedback : feedback
        ));
      }
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Status update කිරීමට නොහැකි විය');
    }
  };

  // ✅ FIXED: Database එකේ data නැත්තම් sample data show කිරීම
  const displayFeedbacks = feedbacks.length > 0 ? feedbacks : getSampleData();

  // Sample data for testing
  function getSampleData() {
    return [
      {
        _id: '1',
        userName: 'John Doe',
        userEmail: 'john@example.com',
        title: 'Great Course Content',
        message: 'The course materials are very comprehensive and helpful.',
        category: 'Course',
        rating: 5,
        status: 'New',
        createdAt: new Date(),
        adminReply: null
      },
      {
        _id: '2', 
        userName: 'Jane Smith',
        userEmail: 'jane@example.com',
        title: 'Technical Issue',
        message: 'Having trouble accessing video lectures.',
        category: 'Technical',
        rating: 3,
        status: 'In Review',
        createdAt: new Date(Date.now() - 86400000),
        adminReply: {
          message: 'We are looking into this issue.',
          repliedBy: 'Admin',
          repliedAt: new Date()
        }
      }
    ];
  }

  // Rest of the component remains the same...
  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"}
          />
        ))}
        <span className="ml-2 text-sm font-medium">({rating}/5)</span>
      </div>
    );
  };

  useEffect(() => {
    loadFeedbacks();
  }, []);

  const filteredFeedbacks = displayFeedbacks.filter(feedback => {
    const matchesSearch = 
      feedback.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.message?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || feedback.status === statusFilter;
    const matchesCategory = categoryFilter === 'All' || feedback.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const statusColors = {
    'New': 'bg-blue-100 text-blue-800',
    'In Review': 'bg-yellow-100 text-yellow-800', 
    'Resolved': 'bg-green-100 text-green-800',
    'Closed': 'bg-gray-100 text-gray-800'
  };

  const categoryColors = {
    'General': 'bg-gray-100 text-gray-800',
    'Technical': 'bg-purple-100 text-purple-800',
    'Course': 'bg-blue-100 text-blue-800',
    'Payment': 'bg-red-100 text-red-800',
    'Support': 'bg-green-100 text-green-800',
    'Other': 'bg-orange-100 text-orange-800'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">💬 Temporary Feedback Dashboard</h1>
              <p className="text-gray-600 mt-2">Student Feedback Management Panel</p>
              {feedbacks.length === 0 && (
                <p className="text-orange-600 text-sm mt-1">
                  📝 No real feedback found. Showing sample data for testing.
                </p>
              )}
            </div>
            <button
              onClick={loadFeedbacks}
              className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
            >
              <RefreshCw size={18} />
              Refresh
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{displayFeedbacks.length}</div>
              <div className="text-purple-800">Total Feedback</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {displayFeedbacks.filter(f => f.status === 'Resolved').length}
              </div>
              <div className="text-green-800">Resolved</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {displayFeedbacks.filter(f => f.status === 'In Review').length}
              </div>
              <div className="text-yellow-800">In Review</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {displayFeedbacks.filter(f => f.status === 'New').length}
              </div>
              <div className="text-blue-800">New</div>
            </div>
          </div>

          {/* Average Rating */}
          {displayFeedbacks.length > 0 && (
            <div className="bg-gradient-to-r from-yellow-400 to-orange-400 p-4 rounded-lg mb-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">
                    {(displayFeedbacks.reduce((sum, f) => sum + f.rating, 0) / displayFeedbacks.length).toFixed(1)}
                  </div>
                  <div>Average Rating</div>
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={20}
                      className={star <= (displayFeedbacks.reduce((sum, f) => sum + f.rating, 0) / displayFeedbacks.length) 
                        ? "text-white fill-current" 
                        : "text-yellow-100"
                      }
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by name, email, title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option value="All">All Status</option>
              <option value="New">New</option>
              <option value="In Review">In Review</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option value="All">All Categories</option>
              <option value="General">General</option>
              <option value="Technical">Technical</option>
              <option value="Course">Course</option>
              <option value="Payment">Payment</option>
              <option value="Support">Support</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* Feedbacks List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading feedbacks...</p>
            </div>
          ) : filteredFeedbacks.length === 0 ? (
            <div className="text-center py-8 bg-white rounded-2xl">
              <ThumbsUp size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">No feedbacks match your search criteria</p>
            </div>
          ) : (
            filteredFeedbacks.map((feedback) => (
              <div key={feedback._id} className="bg-white rounded-2xl shadow-sm p-6">
                {/* Feedback Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{feedback.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[feedback.status]}`}>
                        {feedback.status}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${categoryColors[feedback.category]}`}>
                        {feedback.category}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-2">
                      <div className="flex items-center gap-1">
                        <User size={16} />
                        {feedback.userName || 'Unknown User'}
                      </div>
                      <div className="flex items-center gap-1">
                        <Mail size={16} />
                        {feedback.userEmail}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar size={16} />
                        {new Date(feedback.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="mb-3">
                      {renderStars(feedback.rating)}
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <select
                      value={feedback.status}
                      onChange={(e) => updateStatus(feedback._id, e.target.value)}
                      className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
                    >
                      <option value="New">New</option>
                      <option value="In Review">In Review</option>
                      <option value="Resolved">Resolved</option>
                      <option value="Closed">Closed</option>
                    </select>
                    
                    <button
                      onClick={() => setReplyingTo(replyingTo === feedback._id ? null : feedback._id)}
                      className="flex items-center gap-1 bg-purple-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-purple-700"
                    >
                      <MessageSquare size={16} />
                      Reply
                    </button>
                  </div>
                </div>

                {/* Feedback Message */}
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <p className="text-gray-800 whitespace-pre-wrap">{feedback.message}</p>
                </div>

                {/* Existing Admin Reply */}
                {feedback.adminReply && (
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2 text-green-700">💚 Admin Reply:</h4>
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-semibold text-green-800">{feedback.adminReply.repliedBy}</span>
                        <span className="text-sm text-green-600">
                          {new Date(feedback.adminReply.repliedAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-green-900 whitespace-pre-wrap">{feedback.adminReply.message}</p>
                    </div>
                  </div>
                )}

                {/* Reply Form */}
                {replyingTo === feedback._id && (
                  <div className="border-t pt-4">
                    <textarea
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      placeholder="Type your admin reply here..."
                      rows="3"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => handleAdminReply(feedback._id)}
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
                      >
                        Send Admin Reply
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
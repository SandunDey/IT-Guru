import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FeedbackPage = () => {
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    category: 'General',
    rating: 5
  });
  const [myFeedback, setMyFeedback] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication
    const auth = localStorage.getItem('app_auth');
    if (!auth) {
      navigate('/admin');
      return;
    }

    fetchMyFeedback();
  }, [navigate]);

  const fetchMyFeedback = async () => {
    setIsLoading(true);
    try {
      const auth = localStorage.getItem('app_auth');
      const authData = JSON.parse(auth);
      const token = authData.token;

      const response = await axios.get('/api/feedback/my-feedback', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMyFeedback(response.data.feedback);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('app_auth');
        navigate('/admin');
      } else {
        setError('Failed to load feedback history.');
      }
    }
    setIsLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRatingChange = (rating) => {
    setFormData(prev => ({ ...prev, rating }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const auth = localStorage.getItem('app_auth');
      const authData = JSON.parse(auth);
      const token = authData.token;

      await axios.post('/api/feedback', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSuccess('Feedback submitted successfully!');
      setFormData({
        title: '',
        message: '',
        category: 'General',
        rating: 5
      });
      fetchMyFeedback(); // Refresh the list
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('app_auth');
        navigate('/admin');
      } else {
        setError(err.response?.data?.message || 'Failed to submit feedback.');
      }
    }
    setIsSubmitting(false);
  };

  const getRatingStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Submit Your Feedback</h1>
          <p className="text-gray-600 mt-2">We value your opinion and suggestions</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            {success}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          {/* Feedback Form */}
          <div className="bg-white rounded-lg shadow p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Brief summary of your feedback"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows="5"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Please provide details about your experience, issue, or suggestion"
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="General">General</option>
                  <option value="Technical">Technical</option>
                  <option value="Course">Course</option>
                  <option value="Payment">Payment</option>
                  <option value="Support">Support</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating *
                </label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleRatingChange(star)}
                      className="text-2xl focus:outline-none"
                    >
                      {star <= formData.rating ? '★' : '☆'}
                    </button>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {formData.rating} out of 5 stars
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:bg-indigo-300 transition-colors"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
              </button>
            </form>
          </div>

          {/* Feedback History */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">My Feedback History</h2>
            
            {myFeedback.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-gray-500">You have not submitted any feedback yet.</p>
                <p className="text-gray-400 text-sm mt-1">Your feedback will appear here once submitted.</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {myFeedback.map((feedback) => (
                  <div key={feedback._id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-900">{feedback.title}</h3>
                      <span className="text-yellow-500 text-sm">
                        {getRatingStars(feedback.rating)}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{feedback.message}</p>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span className="bg-gray-100 px-2 py-1 rounded">{feedback.category}</span>
                      <span>{new Date(feedback.createdAt).toLocaleDateString()}</span>
                    </div>
                    {feedback.adminReply && (
                      <div className="mt-3 p-3 bg-blue-50 rounded">
                        <p className="text-sm font-medium text-blue-800">Admin Response:</p>
                        <p className="text-sm text-blue-700">{feedback.adminReply.message}</p>
                        <p className="text-xs text-blue-600 mt-1">
                          By {feedback.adminReply.repliedBy} on {new Date(feedback.adminReply.repliedAt).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage;
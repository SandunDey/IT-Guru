import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

//  Token helper utility
const getToken = () => {
  let token = localStorage.getItem('itguru_token');
  if (!token) {
    token = sessionStorage.getItem('itguru_token');
  }
  return token;
};

const MyTicketsPage = () => {
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTickets = async () => {
      setIsLoading(true);
      try {
        // Use the new endpoint that only returns user's own tickets
        const token = getToken();
        if (!token) {
          setError('Please log in to view your tickets.');
          setIsLoading(false);
          return;
        }

        const response = await axios.get('/api/tickets/my', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setTickets(response.data);
      } catch (err) {
        if (err.response?.status === 401) {
          setError('Please log in to view your tickets.');
        } else if (err.response?.status === 403) {
          setError('Access denied. You can only view your own tickets.');
        } else {
          setError('Failed to fetch tickets.');
        }
        console.error('Error fetching tickets:', err);
      }
      setIsLoading(false);
    };
    fetchTickets();
  }, []);

  const getBadgeClass = (status) => {
    const baseClass = "px-3 py-1 text-xs font-semibold text-white rounded-full";
    switch (status) {
      case 'Open': return `${baseClass} bg-green-500`;
      case 'In Progress': return `${baseClass} bg-yellow-500 text-black`;
      case 'Resolved': return `${baseClass} bg-blue-500`;
      case 'Closed': return `${baseClass} bg-gray-500`;
      default: return `${baseClass} bg-gray-400`;
    }
  };

  // Handle authentication errors by redirecting to login
  if (error === 'Please log in to view your tickets.') {
    return (
      <div className="bg-gray-100 min-h-screen p-4 sm:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Authentication Required</h1>
            <p className="text-gray-600 text-lg mb-6">Please log in to view your support tickets.</p>
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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">My Support Tickets</h1>
          <Link
            to="/submit-ticket"
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            New Ticket
          </Link>
        </div>

        {isLoading && <p className="text-center">Loading your tickets....</p>}
        {error && error !== 'Please log in to view your tickets.' && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
            <p className="text-red-700 font-semibold">{error}</p>
          </div>
        )}
        
        <div className="space-y-4">
          {tickets.map(ticket => (
            <Link to={`/tickets/${ticket._id}`} key={ticket._id} className="block hover:bg-gray-50">
              <div className="bg-white p-5 rounded-lg shadow-md">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{ticket.subject}</h3>
                    <p className="text-xs text-gray-500 font-mono mt-1">Ref: {ticket.referenceCode}</p>
                    <p className="text-sm text-gray-600 mt-1">By: {ticket.name} ({ticket.email})</p>
                    {ticket.replies && ticket.replies.length > 0 && (
                      <p className="text-sm text-blue-600 mt-1">
                        {ticket.replies.length} staff reply{ticket.replies.length !== 1 ? 's' : ''}
                      </p>
                    )}
                  </div>
                  <span className={getBadgeClass(ticket.status)}>{ticket.status}</span>
                </div>
                <p className="text-gray-600 mt-2 truncate">{ticket.message}</p>
                <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                  <span className="text-sm text-gray-500">Submitted: {new Date(ticket.createdAt).toLocaleDateString()}</span>
                  <span className="text-sm text-gray-500">Reg: {ticket.registrationNumber}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {tickets.length === 0 && !isLoading && !error && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No tickets found.</p>
            <Link
              to="/submit-ticket"
              className="text-indigo-600 hover:text-indigo-800 mt-4 inline-block"
            >
              Create your first ticket
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTicketsPage;
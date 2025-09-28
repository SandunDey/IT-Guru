import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const MyTicketsPage = () => {
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = () => {
      const auth = localStorage.getItem('app_auth');
      if (!auth) {
        navigate('/admin');
        return false;
      }
      
      try {
        const authData = JSON.parse(auth);
        if (!authData.token || !authData.user) {
          localStorage.removeItem('app_auth');
          localStorage.removeItem('token');
          navigate('/admin');
          return false;
        }
        return authData.user;
      } catch (error) {
        localStorage.removeItem('app_auth');
        localStorage.removeItem('token');
        navigate('/admin');
        return false;
      }
    };

    const user = checkAuth();
    if (!user) return;

    const fetchTickets = async () => {
      setIsLoading(true);
      try {
        // Try the new endpoint first
        const auth = localStorage.getItem('app_auth');
        const authData = JSON.parse(auth);
        const token = authData.token;

        try {
          // Attempt to get user's specific tickets
          const response = await axios.get('/api/tickets/my-tickets', {
            headers: { 
              Authorization: `Bearer ${token}` 
            },
            data: { email: user.email } // Send user email in request
          });
          setTickets(response.data);
        } catch (apiError) {
          // If new endpoint fails, fall back to getting all tickets
          console.log('My-tickets endpoint failed, falling back to all tickets');
          const allTicketsResponse = await axios.get('/api/tickets');
          const allTickets = allTicketsResponse.data;
          
          // Filter tickets by user's email
          const userTickets = allTickets.filter(ticket => ticket.email === user.email);
          setTickets(userTickets);
        }
      } catch (err) {
        console.error('Error fetching tickets:', err);
        
        if (err.response?.status === 401) {
          localStorage.removeItem('app_auth');
          localStorage.removeItem('token');
          navigate('/admin');
          return;
        }
        
        setError('Failed to fetch tickets. Please try again later.');
      }
      setIsLoading(false);
    };
    
    fetchTickets();
  }, [navigate]);

  const getBadgeClass = (status) => {
    const baseClass = "px-3 py-1 text-xs font-semibold text-white rounded-full";
    switch (status) {
      case 'Open': return `${baseClass} bg-green-500`;
      case 'In Progress': return `${baseClass} bg-yellow-500 text-black`;
      case 'Resolved': return `${baseClass} bg-blue-500`;
      default: return `${baseClass} bg-gray-500`;
    }
  };

  if (isLoading) {
    return (
      <div className="bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your tickets...</p>
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
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
          >
            New Ticket
          </Link>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <div className="space-y-4">
          {tickets.map(ticket => (
            <Link to={`/tickets/${ticket._id}`} key={ticket._id} className="block hover:bg-gray-50">
              <div className="bg-white p-5 rounded-lg shadow-md border border-gray-200">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{ticket.subject}</h3>
                    <p className="text-xs text-gray-500 font-mono mt-1">Ref: {ticket.referenceCode}</p>
                    <p className="text-sm text-gray-600 mt-1">Status: {ticket.status}</p>
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

        {tickets.length === 0 && !isLoading && (
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
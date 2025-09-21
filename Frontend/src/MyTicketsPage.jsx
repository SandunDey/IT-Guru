import React, { useState, useEffect } from 'react';
// 1. 'axios' වෙනුවට අපි සෑදූ 'api' instance එක import කරගන්න
import api from './api'; 
import { Link } from 'react-router-dom';

const MyTicketsPage = () => {
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTickets = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // 2. 'axios.get' වෙනුවට 'api.get' භාවිතා කරන්න සහ නිවැරදි endpoint එක යොදන්න
        const response = await api.get('/api/support-tickets');
        
        // 3. Backend එකෙන් එන object එකෙන් 'tickets' array එක පමණක් ලබාගන්න
        if (response.data && Array.isArray(response.data.tickets)) {
          setTickets(response.data.tickets);
        } else {
          // Backend එකෙන් නිවැරදි දත්ත නොලැබුනහොත් tickets state එක හිස් array එකක් ලෙස සකසන්න
          setTickets([]);
          console.warn("API did not return a 'tickets' array:", response.data);
        }

      } catch (err) {
        setError('Failed to fetch tickets. You may not be logged in.');
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
      default: return `${baseClass} bg-gray-500`;
    }
  };

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

        {isLoading && <p className="text-center">Loading tickets....</p>}
        {error && <p className="text-red-500 font-semibold">{error}</p>}
        
        <div className="space-y-4">
          {/* මෙම කොටස දැන් නිවැරදිව ක්‍රියා කරයි */}
          {tickets.map(ticket => (
            <Link to={`/tickets/${ticket._id}`} key={ticket._id} className="block hover:bg-gray-50">
              <div className="bg-white p-5 rounded-lg shadow-md">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{ticket.subject}</h3>
                    <p className="text-xs text-gray-500 font-mono mt-1">Ref: {ticket.referenceCode}</p>
                    <p className="text-sm text-gray-600 mt-1">By: {ticket.name} ({ticket.email})</p>
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
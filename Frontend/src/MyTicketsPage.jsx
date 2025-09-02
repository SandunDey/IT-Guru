import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const MyTicketsPage = () => {
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [ticketToClose, setTicketToClose] = useState(null);

  useEffect(() => {
    const fetchTickets = async () => {
      setIsLoading(true);
      try {
        // NOTE: For this to show only the logged-in user's tickets,
        // this endpoint must be changed to something like '/api/tickets/mytickets'
        // after authentication is implemented.
        const response = await axios.get('/api/tickets');
        setTickets(response.data);
      } catch (err) {
        setError('Failed to fetch tickets.');
      }
      setIsLoading(false);
    };
    fetchTickets();
  }, []);

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
        <h1 className="text-3xl font-bold text-gray-800 mb-6">My Submitted Tickets</h1>
        {isLoading && tickets.length === 0 && <p>Loading tickets...</p>}
        {error && <p className="text-red-500 font-semibold">{error}</p>}
        <div className="space-y-4">
          {tickets.map(ticket => (
            <Link to={`/tickets/${ticket._id}`} key={ticket._id} className="block hover:bg-gray-50">
      <div className="bg-white p-5 rounded-lg shadow-md">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-bold text-gray-900">{ticket.subject}</h3>
            {/* අලුතින් Reference Code එක පෙන්නනවා */}
            <p className="text-xs text-gray-500 font-mono mt-1">Ref: {ticket.referenceCode}</p>
          </div>
          <span className={getBadgeClass(ticket.status)}>{ticket.status}</span>
        </div>
        <p className="text-gray-600 mt-2 truncate">{ticket.message}</p>
        <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
          <span className="text-sm text-gray-500">Submitted: {new Date(ticket.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </Link>
          ))}
        </div>

        {showConfirmModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
              <h2 className="text-xl font-bold mb-4">Are you sure?</h2>
              <p className="text-gray-600 mb-6">You are about to close this ticket yourself. This action cannot be undone.</p>
              <div className="flex justify-end space-x-4"><button onClick={() => setShowConfirmModal(false)} className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">Cancel</button><button onClick={handleConfirmClose} className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700">Yes, Close My Ticket</button></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTicketsPage;
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const TicketDetailPage = () => {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const pdfContentRef = useRef(null);
  
  const [isDownloading, setIsDownloading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    const fetchTicket = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`/api/tickets/${ticketId}`);
        setTicket(response.data);
      } catch (err) {
        setError('Failed to fetch ticket details.');
      }
      setIsLoading(false);
    };
    fetchTicket();
  }, [ticketId]);

  const handleDownloadPDF = async () => {
    const input = pdfContentRef.current;
    if (!input) {
        setError('PDF content area not found.');
        return;
    }
    setIsDownloading(true);
    window.scrollTo(0, 0);

    try {
      const canvas = await html2canvas(input, {
          scale: 2,
          useCORS: true,
          logging: true,
          backgroundColor: '#ffffff',
          foreignObjectRendering: false, 
      });

      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`ticket-${ticket.referenceCode}.pdf`);

    } catch (err) {
      console.error("PDF Generation Error (html2canvas):", err);
      setError('Could not generate PDF. Please check the console for details.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleConfirmClose = async () => {
    setShowConfirmModal(false);
    setIsLoading(true);
    try {
      const response = await axios.put(`/api/tickets/${ticket._id}`, { status: 'Closed' });
      setTicket(response.data.ticket); 
    } catch (err) {
      setError('Failed to close ticket.');
    }
    setIsLoading(false);
  };


  if (isLoading) return <p className="text-center mt-8">Loading ticket details...</p>;
  if (error) return <p className="text-center mt-8 text-red-500">{error}</p>;
  if (!ticket) return <p className="text-center mt-8">Ticket not found.</p>;

  return (
    <div className="bg-gray-100 min-h-screen p-4 sm:p-8">
      <div className="max-w-5xl mx-auto">
        <button onClick={() => navigate('/my-tickets')} className="mb-4 text-indigo-600 hover:text-indigo-800">
          &larr; Back to My Tickets
        </button>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 break-words mb-4 sm:mb-0">
            {ticket.subject}
          </h1>
          <div className="flex items-center space-x-2">
            <button onClick={handleDownloadPDF} disabled={isDownloading} className="p-2 bg-white rounded-md shadow-sm hover:bg-gray-200 disabled:bg-gray-300 disabled:cursor-not-allowed">
              {isDownloading ? '...' : <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>}
            </button>
            {!['Resolved', 'Closed'].includes(ticket.status) && (
                 <button onClick={() => setShowConfirmModal(true)} className="py-2 px-4 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700">
                    Close Ticket
                 </button>
            )}
            <span className={`px-4 py-2 text-sm font-semibold text-white rounded-md ${ticket.status === 'Resolved' || ticket.status === 'Closed' ? 'bg-gray-500' : 'bg-green-500'}`}>
              Ticket {ticket.status}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div ref={pdfContentRef} className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
            <div className="border-b pb-4">
              <p className="font-bold text-gray-800">{ticket.name} ({ticket.email})</p>
              <p className="text-sm text-gray-500">Created on {new Date(ticket.createdAt).toLocaleString()}</p>
              <p className="mt-4 text-gray-700 whitespace-pre-wrap">{ticket.message}</p>
            </div>
            <div className="mt-6">
                <p className="text-center text-gray-400 font-semibold p-4 border-2 border-dashed rounded-md">
                  Staff replies will appear here.
                </p>
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-bold text-lg mb-4 border-b pb-2">Ticket Properties</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="font-semibold text-gray-600">Reference:</span> <span className="font-mono text-gray-800">{ticket.referenceCode}</span></div>
                <div className="flex justify-between"><span className="font-semibold text-gray-600">Reg Number:</span> <span className="text-gray-800">{ticket.registrationNumber}</span></div>
                <div className="flex justify-between"><span className="font-semibold text-gray-600">Contact:</span> <span className="text-gray-800">{ticket.contactNumber}</span></div>
                <div className="flex justify-between"><span className="font-semibold text-gray-600">Department:</span> <span className="text-gray-800">Student Services</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold mb-4">Are you sure?</h2>
            <p className="text-gray-600 mb-6">You are about to close this ticket. This action cannot be undone.</p>
            <div className="flex justify-end space-x-4">
              <button onClick={() => setShowConfirmModal(false)} className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">Cancel</button>
              <button onClick={handleConfirmClose} className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700">Yes, Close Ticket</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketDetailPage;


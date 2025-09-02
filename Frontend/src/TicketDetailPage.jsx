import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const TicketDetailPage = () => {
  const { ticketId } = useParams(); // URL එකෙන් ticket ID එක ගන්නවා
  const [ticket, setTicket] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const pdfContentRef = useRef(null); // PDF එකට convert කරන කොටස select කරන්න

  useEffect(() => {
    const fetchTicket = async () => {
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

  const handleDownloadPDF = () => {
    const input = pdfContentRef.current;
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`ticket-${ticket.referenceCode}.pdf`);
    });
  };

  if (isLoading) return <p className="text-center mt-8">Loading ticket details...</p>;
  if (error) return <p className="text-center mt-8 text-red-500">{error}</p>;
  if (!ticket) return <p className="text-center mt-8">Ticket not found.</p>;

  return (
    <div className="bg-gray-100 min-h-screen p-4 sm:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 break-words">
            {ticket.subject}
          </h1>
          <div className="flex space-x-2">
            <button onClick={handleDownloadPDF} className="p-2 bg-white rounded-md shadow-sm hover:bg-gray-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
            </button>
            <span className={`px-4 py-2 text-sm font-semibold text-white rounded-md ${ticket.status === 'Resolved' || ticket.status === 'Closed' ? 'bg-red-500' : 'bg-green-500'}`}>
              Ticket {ticket.status}
            </span>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Conversation Area (Left) */}
          <div ref={pdfContentRef} className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
            {/* Student's Message */}
            <div className="border-b pb-4">
              <p className="font-bold text-gray-800">{ticket.name} ({ticket.email})</p>
              <p className="text-sm text-gray-500">Created on {new Date(ticket.createdAt).toLocaleString()}</p>
              <p className="mt-4 text-gray-700 whitespace-pre-wrap">{ticket.message}</p>
            </div>
            
            {/* --- Staff Reply Placeholder --- */}
            <div className="mt-6">
                <p className="text-center text-gray-400 font-semibold p-4 border-2 border-dashed rounded-md">
                  Staff replies will appear here.
                </p>
            </div>
          </div>

          {/* Properties Sidebar (Right) */}
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
    </div>
  );
};

export default TicketDetailPage;
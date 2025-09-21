import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import jsPDF from 'jspdf';

const TicketDetailPage = () => {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
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
        console.error('Error fetching ticket:', err);
      }
      setIsLoading(false);
    };
    fetchTicket();
  }, [ticketId]);

  const handleDownloadPDF = async () => {
    // Check if ticket data is available
    if (!ticket || !ticket.referenceCode) {
      setError('Ticket data is not loaded yet. Please wait.');
      return;
    }
    
    setIsDownloading(true);

    try {
      // Create a new PDF document
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 20;
      const contentWidth = pageWidth - (margin * 2);
      
      let yPosition = margin;
      
      // Add title
      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Support Ticket Details', margin, yPosition);
      yPosition += 15;
      
      // Add reference code
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`Reference: ${ticket.referenceCode}`, margin, yPosition);
      yPosition += 10;
      
      // Add horizontal line
      pdf.setDrawColor(0);
      pdf.setLineWidth(0.5);
      pdf.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 15;
      
      // Add ticket information
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      
      const addField = (label, value) => {
        pdf.setFont('helvetica', 'bold');
        pdf.text(`${label}:`, margin, yPosition);
        pdf.setFont('helvetica', 'normal');
        pdf.text(value, margin + 40, yPosition);
        yPosition += 8;
      };
      
      addField('Name', ticket.name);
      addField('Email', ticket.email);
      addField('Registration', ticket.registrationNumber);
      addField('Contact', ticket.contactNumber);
      addField('Course/Year', ticket.courseOrExamYear);
      addField('Subject', ticket.subject);
      addField('Status', ticket.status);
      addField('Created', new Date(ticket.createdAt).toLocaleString());
      
      yPosition += 10;
      
      // Add message label
      pdf.setFont('helvetica', 'bold');
      pdf.text('Message:', margin, yPosition);
      yPosition += 8;
      
      // Add message content with word wrap
      pdf.setFont('helvetica', 'normal');
      const messageLines = pdf.splitTextToSize(ticket.message, contentWidth);
      pdf.text(messageLines, margin, yPosition);
      yPosition += (messageLines.length * 6) + 15;
      
      // Add replies if they exist
      if (ticket.replies && ticket.replies.length > 0) {
        pdf.setFont('helvetica', 'bold');
        pdf.text('Staff Replies:', margin, yPosition);
        yPosition += 8;
        
        ticket.replies.forEach((reply, index) => {
          if (yPosition > 250) { // Check if we need a new page
            pdf.addPage();
            yPosition = 20;
          }
          
          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'bold');
          pdf.text(`${reply.repliedBy} (${new Date(reply.repliedAt).toLocaleDateString()}):`, margin, yPosition);
          yPosition += 5;
          
          pdf.setFont('helvetica', 'normal');
          const replyLines = pdf.splitTextToSize(reply.text, contentWidth);
          pdf.text(replyLines, margin, yPosition);
          yPosition += (replyLines.length * 5) + 8;
        });
      }
      
      // Add department information
      pdf.setFont('helvetica', 'bold');
      pdf.text('Department: Student Services', margin, yPosition);
      
      // Add footer
      const footerY = pdf.internal.pageSize.getHeight() - 10;
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'italic');
      pdf.text(`Generated on ${new Date().toLocaleString()}`, margin, footerY);
      
      // Save the PDF
      pdf.save(`ticket-${ticket.referenceCode}.pdf`);
    } catch (err) {
      console.error("PDF Generation Error:", err);
      setError('Could not generate PDF. Please try again.');
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
      console.error('Error closing ticket:', err);
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
            <button 
              onClick={handleDownloadPDF} 
              disabled={isDownloading || !ticket || !ticket.referenceCode} 
              className="p-2 bg-white rounded-md shadow-sm hover:bg-gray-200 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
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
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
            <div className="border-b pb-4">
              <p className="font-bold text-gray-800">{ticket.name} ({ticket.email})</p>
              <p className="text-sm text-gray-500">Created on {new Date(ticket.createdAt).toLocaleString()}</p>
              <p className="mt-4 text-gray-700 whitespace-pre-wrap">{ticket.message}</p>
            </div>

            {/* Staff Replies Section */}
            {ticket.replies && ticket.replies.length > 0 ? (
              <div className="mt-6">
                <h3 className="font-semibold text-gray-800 mb-3">Staff Replies:</h3>
                {ticket.replies.map((reply, index) => (
                  <div key={index} className="bg-blue-50 p-4 rounded-lg mb-3">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium text-blue-800">{reply.repliedBy}</span>
                      <span className="text-sm text-blue-600">
                        {new Date(reply.repliedAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-blue-700 whitespace-pre-wrap">{reply.text}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-6">
                <p className="text-center text-gray-400 font-semibold p-4 border-2 border-dashed rounded-md">
                  Staff replies will appear here.
                </p>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-bold text-lg mb-4 border-b pb-2">Ticket Properties</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="font-semibold text-gray-600">Reference:</span> <span className="font-mono text-gray-800">{ticket.referenceCode}</span></div>
                <div className="flex justify-between"><span className="font-semibold text-gray-600">Reg Number:</span> <span className="text-gray-800">{ticket.registrationNumber}</span></div>
                <div className="flex justify-between"><span className="font-semibold text-gray-600">Contact:</span> <span className="text-gray-800">{ticket.contactNumber}</span></div>
                <div className="flex justify-between"><span className="font-semibold text-gray-600">Course/Year:</span> <span className="text-gray-800">{ticket.courseOrExamYear}</span></div>
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
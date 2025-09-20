import { customAlphabet } from 'nanoid';
// Ensure the path is correct (models, not model) - Corrected path below
import SupportTicket from '../model/SupportTicketModel.js';

// --- Create a new support ticket ---
export const createTicket = async (req, res) => {
  try {
    const { 
        name, 
        email, 
        registrationNumber, 
        contactNumber, 
        courseOrExamYear, 
        subject, 
        message 
    } = req.body;

    // Validate input
    if (!name || !email || !registrationNumber || !subject || !message) {
      return res.status(400).json({ message: 'Please fill all required fields.' });
    }

    // Generate the unique reference code
    const nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 6);
    const referenceCode = `TCK-${nanoid()}`;

    // Create a new ticket object WITH the reference code
    const newTicket = new SupportTicket({
        name,
        email,
        registrationNumber,
        contactNumber,
        courseOrExamYear,
        subject,
        message,
        referenceCode, // <-- THIS WAS THE MISSING LINE
    });

    const savedTicket = await newTicket.save();
    res.status(201).json({ message: 'Support ticket created successfully!', ticket: savedTicket });
  } catch (error) {
    console.log("Error creating ticket:", error);
    res.status(500).json({ message: 'Server error while creating ticket.', error: error.message });
  }
};

// --- Get all support tickets ---
export const getAllTickets = async (req, res) => {
  try {
    const tickets = await SupportTicket.find({}).sort({ createdAt: -1 }); // Show newest first
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching tickets.', error: error.message });
  }
};

// --- Get a single ticket by ID ---
export const getTicketById = async (req, res) => {
  try {
    const ticket = await SupportTicket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found.' });
    }
    res.status(200).json(ticket);
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching ticket.', error: error.message });
  }
};

// --- Update a ticket by ID (For Admin/Staff use) ---
export const updateTicket = async (req, res) => {
  try {
    const { subject, message, status, priority, reply, repliedBy } = req.body;
    
    const updateData = { subject, message, status, priority };
    
    // If reply is provided, add it to the replies array
    if (reply && repliedBy) {
      updateData.$push = {
        replies: {
          text: reply,
          repliedBy: repliedBy,
          repliedAt: new Date()
        }
      };
    }

    const updatedTicket = await SupportTicket.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedTicket) {
      return res.status(404).json({ message: 'Ticket not found.' });
    }
    res.status(200).json({ message: 'Ticket updated successfully!', ticket: updatedTicket });
  } catch (error) {
    res.status(500).json({ message: 'Server error while updating ticket.', error: error.message });
  }
};

// --- Delete a ticket by ID (Generally not recommended, use 'Closed' status instead) ---
export const deleteTicket = async (req, res) => {
  try {
    const deletedTicket = await SupportTicket.findByIdAndDelete(req.params.id);
    if (!deletedTicket) {
      return res.status(404).json({ message: 'Ticket not found.' });
    }
    res.status(200).json({ message: 'Ticket deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error while deleting ticket.', error: error.message });
  }
};
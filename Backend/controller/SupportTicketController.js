import { customAlphabet } from 'nanoid';
import SupportTicket from '../model/SupportTicketModel.js';

// --- Create a new support ticket ---
export const createTicket = async (req, res) => {
  try {
    
    // --- අලුත් fields ටික මෙතනට ගන්න ---
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

    const nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 6);
    const referenceCode = `TCK-${nanoid()}`;

    const newTicket = new SupportTicket({
        name,
        email,
        registrationNumber,
        contactNumber,
        courseOrExamYear,
        subject,
        message,
    });

    const savedTicket = await newTicket.save();
    res.status(201).json({ message: 'Support ticket created successfully!', ticket: savedTicket });
  } catch (error) {
    res.status(500).json({ message: 'Server error while creating ticket.', error: error.message });
  }
};

// --- Get all support tickets ---
export const getAllTickets = async (req, res) => {
  try {
    const tickets = await SupportTicket.find({});
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

// --- Update a ticket by ID ---
export const updateTicket = async (req, res) => {
  try {
    const { title, description, status, priority } = req.body;
    const updatedTicket = await SupportTicket.findByIdAndUpdate(
      req.params.id,
      { title, description, status, priority },
      { new: true, runValidators: true } // 'new: true' returns the updated document
    );

    if (!updatedTicket) {
      return res.status(404).json({ message: 'Ticket not found.' });
    }
    res.status(200).json({ message: 'Ticket updated successfully!', ticket: updatedTicket });
  } catch (error) {
    res.status(500).json({ message: 'Server error while updating ticket.', error: error.message });
  }
};

// --- Delete a ticket by ID ---
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
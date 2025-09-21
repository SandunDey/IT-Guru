import { customAlphabet } from 'nanoid';
// Ensure the path is correct (models, not model) - Corrected path below
import SupportTicket from '../model/SupportTicketModel.js';

// --- Create a new support ticket ---
export const createTicket = async (req, res) => {
  try {
    // Check if user is authenticated
    if (!req.user || !req.user.email) {
      return res.status(401).json({ message: 'Authentication required to create a ticket.' });
    }

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

    // Ensure the email matches the authenticated user's email
    if (email !== req.user.email) {
      return res.status(403).json({ message: 'You can only create tickets with your own email address.' });
    }

    // Generate the unique reference code
    const nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 6);
    const referenceCode = `TCK-${nanoid()}`;

    // Create a new ticket object WITH the reference code and user association
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

// --- Get all support tickets (Admin/Staff only) ---
export const getAllTickets = async (req, res) => {
  try {
    const tickets = await SupportTicket.find({}).sort({ createdAt: -1 }); // Show newest first
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching tickets.', error: error.message });
  }
};

// --- Get user's own tickets ---
export const getMyTickets = async (req, res) => {
  try {
    // Check if user is authenticated
    if (!req.user || !req.user.email) {
      return res.status(401).json({ message: 'Authentication required.' });
    }

    // Find tickets created by the authenticated user
    const tickets = await SupportTicket.find({ 
      email: req.user.email 
    }).sort({ createdAt: -1 });
    
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching your tickets.', error: error.message });
  }
};

// --- Get a single ticket by ID ---
export const getTicketById = async (req, res) => {
  try {
    // Check if user is authenticated
    if (!req.user || !req.user.email) {
      return res.status(401).json({ message: 'Authentication required.' });
    }

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
    // Check if user is authenticated
    if (!req.user || !req.user.email) {
      return res.status(401).json({ message: 'Authentication required.' });
    }

    const ticket = await SupportTicket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found.' });
    }

    const { subject, message, status, priority, reply, repliedBy } = req.body;
    
    // Check permissions
    const isOwner = ticket.email === req.user.email;
    const isAdminOrStaff = req.user.role && ['admin', 'staff'].includes(req.user.role.toLowerCase());
    
    // Users can only update their own tickets' subject and message
    // Admin/Staff can update everything
    if (!isOwner && !isAdminOrStaff) {
      return res.status(403).json({ message: 'Access denied.' });
    }

    let updateData = {};
    
    if (isAdminOrStaff) {
      // Admin/Staff can update everything
      updateData = { subject, message, status, priority };
      
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
    } else {
      // Regular users can only update subject and message of their own tickets
      // And only if ticket is not closed/resolved
      if (['Resolved', 'Closed'].includes(ticket.status)) {
        return res.status(400).json({ message: 'Cannot update a resolved or closed ticket.' });
      }
      updateData = { subject, message };
    }

    const updatedTicket = await SupportTicket.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({ message: 'Ticket updated successfully!', ticket: updatedTicket });
  } catch (error) {
    res.status(500).json({ message: 'Server error while updating ticket.', error: error.message });
  }
};

// --- Delete a ticket by ID (Admin only) ---
export const deleteTicket = async (req, res) => {
  try {
    // Check if user is authenticated and is admin
    if (!req.user || !req.user.email) {
      return res.status(401).json({ message: 'Authentication required.' });
    }

    if (!req.user.role || req.user.role.toLowerCase() !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }

    const deletedTicket = await SupportTicket.findByIdAndDelete(req.params.id);
    if (!deletedTicket) {
      return res.status(404).json({ message: 'Ticket not found.' });
    }
    res.status(200).json({ message: 'Ticket deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error while deleting ticket.', error: error.message });
  }
};
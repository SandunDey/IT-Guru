import express from 'express';
import {
  createTicket,
  getAllTickets,
  getTicketById,
  updateTicket,
  deleteTicket,
  getMyTickets, // නව function එක import කරන්න
} from '../controller/SupportTicketController.js';

const router = express.Router();

// CREATE: POST /api/tickets (Public - anyone can create ticket)
router.post('/', createTicket);

// READ: GET /api/tickets/my-tickets (Get logged in user's tickets)
router.get('/my-tickets', getMyTickets);

// READ: GET /api/tickets (Get all tickets - for staff/admin)
router.get('/', getAllTickets);

// READ: GET /api/tickets/:id (Get single ticket)
router.get('/:id', getTicketById);

// UPDATE: PUT /api/tickets/:id (Update ticket)
router.put('/:id', updateTicket);

// DELETE: DELETE /api/tickets/:id (Delete ticket)
router.delete('/:id', deleteTicket);

export default router;
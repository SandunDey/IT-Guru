import express from 'express';
import {
  createTicket,
  getAllTickets,
  getMyTickets,
  getTicketById,
  updateTicket,
  deleteTicket,
} from '../controller/SupportTicketController.js';
import auth from '../middleware/auth.js'; // <-- 1. auth middleware එක import කරන්න


const router = express.Router();

router.use(auth); // මෙමගින් පහත ඇති සියලුම routes ආරක්ෂිත වේ


// CREATE: POST /api/tickets
router.post('/', createTicket);

// READ: GET /api/tickets (Admin/Staff only - gets all tickets)
router.get('/', getAllTickets);

// READ: GET /api/tickets/my (User's own tickets)
router.get('/my', getMyTickets);

// READ: GET /api/tickets/:id (Single ticket - owner or admin/staff only)
router.get('/:id', getTicketById);

// UPDATE: PUT /api/tickets/:id (Update ticket)
router.put('/:id', updateTicket);

// DELETE: DELETE /api/tickets/:id (Admin only)
router.delete('/:id', deleteTicket);

export default router;
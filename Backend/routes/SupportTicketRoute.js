import express from 'express';
import {
  createTicket,
  getAllTickets,
  getTicketById,
  updateTicket,
  deleteTicket,
} from '../controller/SupportTicketController.js';
import auth from '../middleware/auth.js'; // <-- 1. auth middleware එක import කරන්න


const router = express.Router();

router.use(auth); // මෙමගින් පහත ඇති සියලුම routes ආරක්ෂිත වේ


// CREATE: POST /api/support-tickets
router.post('/', createTicket);

// READ: GET /api/support-tickets
router.get('/', getAllTickets);

// READ: GET /api/support-tickets/:id
router.get('/:id', getTicketById);

// UPDATE: PUT /api/support-tickets/:id
router.put('/:id', updateTicket);

// DELETE: DELETE /api/support-tickets/:id
router.delete('/:id', deleteTicket);

export default router;
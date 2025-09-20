import express from 'express';
import {
  createTicket,
  getAllTickets,
  getTicketById,
  updateTicket,
  deleteTicket,
} from '../controller/SupportTicketController.js';

const router = express.Router();

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
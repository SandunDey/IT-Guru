import express from 'express';
import {
  createTicket,
  getAllTickets,
  getTicketById,
  updateTicket,
  deleteTicket,
} from '../controller/SupportTicketController.js';

const router = express.Router();

// CREATE: POST /api/tickets
router.post('/', createTicket);

// READ: GET /api/tickets (Get all.)
router.get('/', getAllTickets);

// READ: GET /api/tickets/:id (Get one by ID)
router.get('/:id', getTicketById);

// UPDATE: PUT /api/tickets/:id
router.put('/:id', updateTicket);

// DELETE: DELETE /api/tickets/:id
router.delete('/:id', deleteTicket);

export default router;
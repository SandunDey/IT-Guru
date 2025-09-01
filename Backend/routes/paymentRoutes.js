// routes/paymentRoutes.js
import { Router } from "express";
import {
  createPayment,
  getPayments,
  getPaymentById,
  updatePayment,
  softDeletePayment
} from "../controller/paymentController.js"; // NOTE: 'controller' (singular)

const router = Router();

// Quick health check to verify mount
router.get("/health", (req, res) => res.json({ ok: true }));

// CRUD
router.post("/", createPayment);       // POST /api/payment
router.get("/", getPayments);          // GET  /api/payment
router.get("/:id", getPaymentById);    // GET  /api/payment/:id
router.patch("/:id", updatePayment);   // PATCH /api/payment/:id
router.delete("/:id", softDeletePayment); // DELETE /api/payment/:id

export default router;

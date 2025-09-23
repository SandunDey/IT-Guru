// routes/paymentRoutes.js
import { Router } from "express";
import {
  createPayment
  
} from "../controller/paymentController.js"; // NOTE: 'controller' (singular)

const paymentRouter = Router();

// Quick health check to verify mount
paymentRouter.get("/health", (req, res) => res.json({ ok: true }));

// CRUD
paymentRouter.post("/add/:id", createPayment);       // POST /api/payment
// router.get("/", getPayments);          // GET  /api/payment
// router.get("/:id", getPaymentById);    // GET  /api/payment/:id
// router.patch("/:id", updatePayment);   // PATCH /api/payment/:id
// router.delete("/:id", softDeletePayment); // DELETE /api/payment/:id

export default paymentRouter;

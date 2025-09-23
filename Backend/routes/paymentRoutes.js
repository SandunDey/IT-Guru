// routes/paymentRoutes.js
import { Router } from "express";
import { createPayment, getReceipt } from "../controller/paymentController.js";

const paymentRouter = Router();

// Quick health check to verify mount
paymentRouter.get("/health", (req, res) => res.json({ ok: true }));

// create payment
paymentRouter.post("/add/:id", createPayment);

// new: download receipt
paymentRouter.get("/receipt/:id", getReceipt);

export default paymentRouter;

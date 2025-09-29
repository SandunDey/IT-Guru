// routes/authRoute.js
import express from "express";
import { studentSignup, login } from "../controller/authController.js";

const router = express.Router();

router.post("/signup", studentSignup);    // POST /api/auth/signup  (student only)
router.post("/login", login);             // POST /api/auth/login

export default router;

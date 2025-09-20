// routes/AdminRoute.js
import express from "express";
import { signup, login, listAdmins } from "../controller/adminController.js";
import { authRequired, requireRole } from "../middleware/auth.js";

const adminrouter = express.Router();

adminrouter.post("/signup", signup);
adminrouter.post("/login", login);
adminrouter.get("/", authRequired, requireRole("admin"), listAdmins);

export default adminrouter;

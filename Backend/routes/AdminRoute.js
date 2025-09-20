
import express from "express";
import AdminController from "../controller/logingController.js";
import { saveAdmin } from "../controller/adminController.js";

const adminrouter = express.Router();


adminrouter.post("/login", AdminController);
adminrouter.post("/save", saveAdmin);

export default adminrouter;

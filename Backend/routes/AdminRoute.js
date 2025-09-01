
import express from "express";
import AdminController from "../controller/logingControler.js";

const adminrouter = express.Router();


adminrouter.post("/login", AdminController);

export default adminrouter;

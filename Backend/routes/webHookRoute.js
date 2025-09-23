import express from "express";
import {handleWebhook}  from "../controller/webhookController.js";

const webhookRoutes = express.Router();

// POST /webhook
webhookRoutes.post("/",handleWebhook);

export default webhookRoutes;
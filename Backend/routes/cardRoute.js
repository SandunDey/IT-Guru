// routes/AdminRoute.js
import express from "express";
import { addClassCard, getClassCards, getSelectedPlan } from "../controller/classCardController.js";


const cardRoute = express.Router();

cardRoute.post("/add", addClassCard);
// cardRoute.post("/login", login);
cardRoute.get("/",getClassCards);
cardRoute.get("/card/:class_name",getSelectedPlan)

export default cardRoute;

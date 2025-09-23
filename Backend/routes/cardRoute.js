// routes/AdminRoute.js
import express from "express";
import { addClassCard, getClassCards } from "../controller/classCardController.js";


const cardRoute = express.Router();

cardRoute.post("/add", addClassCard);
// cardRoute.post("/login", login);
cardRoute.get("/",getClassCards);

export default cardRoute;

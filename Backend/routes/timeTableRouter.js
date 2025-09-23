import express from "express";
import {
  createTimetable,
  getAllTimetable,
  getTimetableById,
  updateTimetable,
  deleteTimetable,
} from "../controller/timeTableController.js";

const timeTableRouter = express.Router();//create router obj to hold routes

timeTableRouter.post("/makeTimetable", createTimetable);
timeTableRouter.get("/allTimetables", getAllTimetable);
timeTableRouter.get("/getTimetableId/:timetableID", getTimetableById);//:timetableID -placeholder mona TT ekd gnn ona kiyl kiynna
timeTableRouter.put("/updateTimetable/:timetableID", updateTimetable);
timeTableRouter.delete("/deleteTimetable/:timetableID", deleteTimetable);

export default timeTableRouter;

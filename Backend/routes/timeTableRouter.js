
import express from "express";
import {
  createTimetable,
  getAllTimetable,
  getTimetableById,
  updateTimetable,
  deleteTimetable,
} from "../controller/timeTableController.js";

const timeTableRouter = express.Router();

timeTableRouter.post("/makeTimetable", createTimetable);
timeTableRouter.get("/allTimetables", getAllTimetable);
timeTableRouter.get("/getTimetableId/:TimetableID", getTimetableById);
timeTableRouter.put("/updateTimetable/:TimetableID", updateTimetable);
timeTableRouter.delete("/deleteTimetable/:TimetableID", deleteTimetable);

export default timeTableRouter;

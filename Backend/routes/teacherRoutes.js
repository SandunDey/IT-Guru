import express from "express";
import { registerTeacher, getAllTeachers, loginTeacher } from "../controller/teacherController.js";

const router = express.Router();

router.post("/register", registerTeacher);
router.post("/login", loginTeacher);
router.get("/", getAllTeachers);

export default router;

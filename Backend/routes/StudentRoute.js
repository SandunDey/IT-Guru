import express from "express";
import {
  deleteStudent,
  getAllStudents,
  getStudentById,      // <-- ADD
  loginStudent,
  saveStudent,
  updateStudent,
  getMe,
} from "../controller/StudentController.js";
import { authRequired } from "../middleware/auth.js"; // adjust path if needed

const StudentRoute = express.Router();

// Base mount: app.use("/api/Student", StudentRoute)
StudentRoute.post("/", saveStudent);
StudentRoute.get("/", getAllStudents);
StudentRoute.get("/:studentId", getStudentById);   // <-- ADD THIS
StudentRoute.put("/:studentId", updateStudent);
StudentRoute.delete("/:studentId", deleteStudent);
StudentRoute.post("/login", loginStudent);
StudentRoute.get("/me", authRequired, getMe);


export default StudentRoute;

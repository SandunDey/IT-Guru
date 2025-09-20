import express from "express";
import {
  deleteStudent,
  getAllStudents,
  loginStudent,
  saveStudent,
  updateStudent,
  verifyStudent,
} from "../controller/StudentController.js";

const StudentRoute = express.Router();

// Base mount (e.g., app.use("/api/Student", StudentRoute))
StudentRoute.post("/register", saveStudent);
StudentRoute.get("/", getAllStudents);
StudentRoute.put("/:studentId", updateStudent);
StudentRoute.delete("/:studentId", deleteStudent);
StudentRoute.post("/login", loginStudent);
StudentRoute.get("/verify/:studentId",verifyStudent);
export default StudentRoute;

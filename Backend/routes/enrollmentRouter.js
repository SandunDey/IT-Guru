import express from 'express';
import { createEnrollment, deleteEnrollment, getAllEnrollment, getEnrollmentByYear, updateEnrollment } from '../controller/enrollmentController.js';


const enrollmentRouter = express.Router();//Express eke router object ekak hadanawa (routes manage karanna)

enrollmentRouter.get("/year/:classYear", getEnrollmentByYear)// Get all enrollments by class year (dynamic param)
enrollmentRouter.get("/", getAllEnrollment)
enrollmentRouter.post("/", createEnrollment)
enrollmentRouter.delete("/:enrollmentID", deleteEnrollment);// Delete an enrollment by ID
enrollmentRouter.put("/:enrollmentID", updateEnrollment)// Update an enrollment by ID

export default enrollmentRouter;
import express from 'express';
import { createEnrollment, deleteEnrollment, getAllEnrollment, getEnrollmentByYear, updateEnrollment } from '../controller/enrollmentController.js';


const enrollmentRouter = express.Router();

enrollmentRouter.get("/year/:classYear", getEnrollmentByYear)
enrollmentRouter.get("/", getAllEnrollment)
enrollmentRouter.post("/", createEnrollment)
enrollmentRouter.delete("/:enrollmentID", deleteEnrollment);
enrollmentRouter.put("/:enrollmentID", updateEnrollment)

export default enrollmentRouter;
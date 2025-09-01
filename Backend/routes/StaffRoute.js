
import express from "express";
import { getAllStaff, getStaffbyId, loginStaff, registerStaff, updateStaff } from "../controller/StaffControler.js";
import { deleteStudent } from "../controller/StudentController.js";

const StaffRouter = express.Router();

StaffRouter.post("/register",registerStaff);
StaffRouter.post("/loging",loginStaff);
StaffRouter.get("/viewStaffmember",getAllStaff);
StaffRouter.put("/updateStaffmember/:id",updateStaff);
StaffRouter.delete("/deleteStaffmember/:id",deleteStudent);
StaffRouter.get("/viewStaffmember/:id",getStaffbyId);

export default StaffRouter;

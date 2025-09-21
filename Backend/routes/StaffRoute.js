
// import express from "express";
// //import { getAllStaff, getStaffbyId, loginStaff, registerStaff, updateStaff } from "../controller/StaffControler.js";
// //import { deleteStudent } from "../controller/StudentController.js";
// import { getAllStaff, getStaffbyId, loginStaff, registerStaff, updateStaff, deleteStaff } from "../controller/StaffControler.js";

// const StaffRouter = express.Router();

// StaffRouter.post("/register",registerStaff);
// StaffRouter.post("/loging",loginStaff);
// StaffRouter.get("/viewStaffmember",getAllStaff);
// StaffRouter.put("/updateStaffmember/:id",updateStaff);
// StaffRouter.delete("/deleteStaffmember/:id",deleteStaff);
// StaffRouter.get("/viewStaffmember/:id",getStaffbyId);

// export default StaffRouter;


// routes/StaffRoute.js
import express from "express";
import {
  registerStaff,
  loginStaff,
  getAllStaff,
  getStaffbyId,
  updateStaff,
  deleteStaff,
} from "../controller/StaffControler.js";

const StaffRouter = express.Router();

// ✅ Every param has a name (":id") and paths are plain strings
StaffRouter.post("/register", registerStaff);
StaffRouter.post("/loging", loginStaff);
StaffRouter.get("/viewStaffmember", getAllStaff);
StaffRouter.get("/viewStaffmember/:id", getStaffbyId);
StaffRouter.put("/updateStaffmember/:id", updateStaff);
StaffRouter.delete("/deleteStaffmember/:id", deleteStaff);

export default StaffRouter;


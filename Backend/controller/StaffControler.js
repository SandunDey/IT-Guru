
import dotenv from 'dotenv';
import loggingController from "./logingControler.js";
import Staff from "../model/Staff.js";
import bcrypt from 'bcrypt';

dotenv.config();

export async  function registerStaff(req,res){
    const staff = new Staff(req.body);
    const hashedPassword = bcrypt.hashSync(req.body.password,10);
    const staff1={
        ...req.body,
        password:hashedPassword,
        role:'staff'
    };
    try{
        await staff.save();
        res.status(201).json({
            message: "Staff registered successfully",
        });
    }catch(err){
        res.status(500).json({
            message: "Error registering staff",
            error: err.message
        });
    }

}
export function getAllStaff(req,res){
    Staff.find().then(
        (staff) => {
            res.json(staff);
        }
    ).catch(
        (err) => {
            res.status(500).json({
                message: "Error retrieving staffmember",
                error: err.message
            });
        }
    );
}
export function loginStaff(req, res) {
    req.body.role = 'staff';  
    return loggingController(req, res);
}
export function updateStaff(req, res) {
    if(req.user == null){
        res.status(403).json({
            message: "Please login as admin to update a staff"
        });
        return;
    }
    if(req.user.role != "admin"){
        res.status(403).json({
            message: "You are not authorized to update a staff"
        });

    Staff.findOneAndUpdate({ 
        staffId: req.params.id },
        req.body).then(
        (staff) => {
            if (!staff) {
                return res.status(404).json({ 
                    message: 'Staffmenber not found' });
            }else{
                res.status(200).json({
                    message: "Staffmember updated successfully",
                    staff: staff
                });
            }  
        }
    ).catch(
        (err) => {
            res.status(500).json({
                message: "Error updating staffmember",
                error: err.message
            });
        }
    );
}
}
export function deleteStaff(req, res) {
    if(req.user == null){
        res.status(403).json({
            message: "Please login as admin to delete a staffmember"
        });
        return;
    }
    if(req.user.role != "admin"){
        res.status(403).json({
            message: "You are not authorized to delete a staffmember"
        });
        return;
    }
    Staff.findOneAndDelete({ staffId: req.params.id }).then(
        (staff) => {
            if (!staff) {
                return res.status(404).json({ 
                    message: 'Staffmember not found' });
            }
            res.status(200).json({
                message: "Staffmember deleted successfully"
            });
        }
    ).catch(
        (err) => {
            res.status(500).json({
                message: "Error deleting staffmember",
                error: err.message
            });
        }
    );
}
export function getStaffbyId(req,res){
    Staff.findOne({ staffId: req.params.id }).then(
        (staff) => {
            if (!staff) {
                return res.status(404).json({ 
                    message: 'Staff member not found' });
            }
            res.status(200).json({
                staff: staff
            });
        }
    ).catch(
        (err) => {
            res.status(500).json({
                message: "Error retrieving staffmember",
                error: err.message
            });
        }
    );
}
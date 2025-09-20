import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import loggingController from "./logingController.js";
import Admin from '../model/Admin.js';

dotenv.config();

export function saveAdmin(req, res) {
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    console.log(hashedPassword);

    const admin = new Admin({
        name: req.body.name,
        email: req.body.email,
        phonenumber: req.body.phonenumber,
        password: hashedPassword,
        role: (req.body.role || 'admin').toLowerCase(),
    });
    admin.save()
        .then(() => {
            res.status(201).json({
                message: "admin saved successfully", admin
            });
        }).catch((err) => {
            res.status(500).json({
                message: "Error saving admin",
                error: err.message
            });
        });
}

export function adminLoging(req, res) {
    req.body.role = 'admin';
    return loggingController(req, res);
}
export async function getAllAdmins(req, res) {
    try {
        const admins = await Admin.find();
        res.json(admins);
    } catch (err) {
        res.status(500).json({
            message: "Error retrieving admins",
            error: err.message
        });
    }
}

export function isAdmin(req) {

    //only admin user can ->
    if (req.user == null) {
        return false; //pahala code tika run vena eka methanin ehat navathinva
    }

    if (req.user.role != "admin") {
        return false;
    }

    return true;

}



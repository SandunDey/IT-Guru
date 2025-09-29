// controller/authController.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

import Student from "../model/Student.js";
import Teacher from "../model/Teacher.js";
import Admin from "../model/Admin.js";

const JWT_SECRET = process.env.JWT_SECRET || process.env.JWT_KEY || "dev-secret";

function norm(s) { return String(s || "").trim().toLowerCase(); }

export async function studentSignup(req, res) {
  try {
    // Only allow creating students via this endpoint
    const {
      name, address, year, nic, birthday, gender,
      email, password, confirmPassword, phonenumber
    } = req.body;

    if (!name || !email || !password || !confirmPassword || !phonenumber) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Password and confirmPassword do not match" });
    }

    // prevent signup if email already exists in any model
    const existing =
      await Student.findOne({ email }) ||
      await Teacher.findOne({ email }) ||
      await Admin.findOne({ email });

    if (existing) return res.status(409).json({ message: "Email already in use" });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const student = new Student({
      name, address, year, nic, birthday, gender,
      email, password: hashed, phonenumber
    });

    await student.save();
    // do not return password
    const s = student.toObject();
    delete s.password;

    return res.status(201).json({ message: "Student created", student: s });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

/**
 * Login for student/teacher/admin
 * body: { email, password, role }  -> role optional, default try student first
 */
export async function login(req, res) {
  try {
    const { email, password } = req.body;
    let role = norm(req.body.role || ""); // may be "", "student", "teacher", "admin"

    // choose model based on role if provided, otherwise attempt Student -> Teacher -> Admin
    const tryModel = async (Model) => {
      if (!Model) return null;
      return await Model.findOne({ email }).select("+password");
    };

    let user = null;
    let userRole = null;

    if (role === "student") {
      user = await tryModel(Student); userRole = "student";
    } else if (role === "teacher") {
      user = await tryModel(Teacher); userRole = "teacher";
    } else if (role === "admin") {
      user = await tryModel(Admin); userRole = "admin";
    } else {
      // role not specified -> try search order student, teacher, admin
      user = await tryModel(Student);
      if (user) userRole = "student";
      else { user = await tryModel(Teacher); if (user) userRole = "teacher"; }
      if (!user) { user = await tryModel(Admin); if (user) userRole = "admin"; }
    }

    if (!user) return res.status(404).json({ message: "User not found" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: "Invalid password" });

    // create token payload (minimal)
    const payload = { sub: user._id.toString(), role: userRole, email: user.email };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

    // prepare safe user object (strip password)
    const safe = user.toObject ? user.toObject() : { ...user };
    delete safe.password;

    return res.json({ message: "Login successful", token, user: safe, role: userRole });
  } catch (err) {
    console.error("Auth login error:", err);
    return res.status(500).json({ message: "Login failed" });
  }
}

// controller/teacherController.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Teacher from "../model/Teacher.js";

// Register a new teacher
export async function registerTeacher(req, res) {
  try {
    const { name, email, password, phonenumber } = req.body;

    if (!name || !email || !password || !phonenumber) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingTeacher = await Teacher.findOne({ email });
    if (existingTeacher) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const teacher = new Teacher({
      name,
      email,
      password: hashedPassword,
      phonenumber,
      role: "teacher",
    });

    await teacher.save();
    res.status(201).json({ message: "Teacher registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error registering teacher", error: err.message });
  }
}

// Get all teachers
export async function getAllTeachers(req, res) {
  try {
    const teachers = await Teacher.find();
    res.json(teachers);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving teachers", error: err.message });
  }
}

// Teacher login
export async function loginTeacher(req, res) {
  try {
    const { email, password } = req.body;

    const teacher = await Teacher.findOne({ email });
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    const validPassword = bcrypt.compareSync(password, teacher.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // ✅ Create token
    const payload = { id: teacher._id, role: teacher.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET || "secret", {
      expiresIn: "2h",
    });

    res.json({ message: "Login successful", teacher, token });
  } catch (err) {
    res.status(500).json({ message: "Login error", error: err.message });
  }
}

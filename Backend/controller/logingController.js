import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Admin from "../model/Admin.js";
import Teacher from "../model/Teacher.js";
import Staff from "../model/Staff.js";


dotenv.config();

function norm(r) { return String(r || '').replace(/\s+/g, '').toLowerCase(); }

export default async function AdminController(req, res) {
  try {
    const { email, password } = req.body;
    const roleKey = norm(req.body.role);

    let Model, notFoundMsg;
    if (roleKey === 'admin') { Model = Admin; notFoundMsg = 'Admin not found'; }
    else if (roleKey === 'teacher') { Model = Teacher; notFoundMsg = 'Teacher not found'; }
    else if (roleKey === 'staff') { Model = Staff; notFoundMsg = 'Staff not found' }

    else return res.status(400).json({ message: 'Unsupported role' });

    const student = await Model.findOne({ email }).select('+password');
    if (!student) return res.status(404).json({ message: notFoundMsg });

    const ok = await bcrypt.compare(password, student.password);
    if (!ok) return res.status(401).json({ message: 'Invalid password' });

    const token = jwt.sign({ id: student._id, role: student.role }, process.env.JWT_KEY);

    const safe = student.toObject();
    delete safe.password;
    return res.json({ message: 'Login successful', token, student: safe });
  } catch (err) {
    console.error('login error:', err);
    return res.status(500).json({ message: 'Login failed' });
  }
}
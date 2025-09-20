// controller/adminController.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Admin from "../model/Admin.js";

/** POST /api/admin/signup */
export async function signup(req, res) {
  try {
    const { name, email, password, phoneNumber } = req.body;
    if (!name || !email || !password || !phoneNumber) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const hash = await bcrypt.hash(password, 10);
    const admin = await Admin.create({
      name,
      email,
      phoneNumber,
      password: hash,
      role: "admin",
    });
    return res.status(201).json({
      message: "Admin created",
      admin: { id: admin._id, name: admin.name, email: admin.email, phoneNumber: admin.phoneNumber, role: admin.role },
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

/** POST /api/admin/login */
export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, admin.password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { sub: admin._id.toString(), role: "admin", email: admin.email },
      process.env.JWT_SECRET || "dev-secret",
      { expiresIn: "2h" }
    );

    return res.json({
      token,
      user: { id: admin._id, name: admin.name, email: admin.email, role: "admin" },
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

/** GET /api/admin (protected, admin only) */
export async function listAdmins(_req, res) {
  const admins = await Admin.find().select("-password");
  return res.json(admins);
}

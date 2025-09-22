import Student from "../model/Student.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();

export async function saveStudent(req, res) {
  try {
    const {
    
      name,
      address,
      year,
      nic,
      birthday,
      gender,
      email,
      password,
      confirmPassword,
      phonenumber,
      
    } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Password and Confirm Password do not match" });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const student = new Student({
    
      name,
      address,
      year,
      nic,
      birthday,
      gender,
      email,
      password: hashedPassword,
      phonenumber,
    });

    await student.save();

    return res.status(201).json({ message: "Student saved successfully", student });
  } catch (err) {
    return res.status(500).json({ message: "Error saving student", error: err.message });
  }
}

export function getAllStudents(req, res) {
  Student.find()
    .then((students) => res.json(students))
    .catch(() => res.status(500).json({ message: "Error searching students" }));
}

// NEW: fetch a single student by their public studentId
export function getStudentById(req, res) {
  Student.findOne({ studentId: req.params.studentId })
    .then((student) => {
      if (!student) return res.status(404).json({ message: "Student not found" });
      return res.json(student);
    })
    .catch(() => res.status(500).json({ message: "Error fetching student" }));
}

// Improved: hash password if provided, strip confirmPassword, keep validators on
export async function updateStudent(req, res) {
  try {
    const update = { ...req.body };
    delete update.confirmPassword;

    if (update.password) {
      const salt = bcrypt.genSaltSync(10);
      update.password = bcrypt.hashSync(update.password, salt);
    }

    const student = await Student.findOneAndUpdate(
      { studentId: req.params.studentId },
      update,
      { new: true, runValidators: true }
    );

    if (!student) return res.status(404).json({ message: "Student not found" });

    return res.json({ message: "Student updated successfully", student });
  } catch (e) {
    return res.status(500).json({ message: "Error updating student" });
  }
}

export function deleteStudent(req, res) {
  Student.findOneAndDelete({ studentId: req.params.studentId })
    .then((student) => {
      if (!student) return res.status(404).json({ message: "Student not found" });
      return res.json({ message: "Student deleted successfully" });
    })
    .catch(() => res.status(500).json({ message: "Error deleting student" }));
}

export function loginStudent(req, res) {
  const email = req.body.email;
  const password = req.body.password;

  Student.findOne({ email })
    .then((student) => {
      if (!student) {
        return res.json({ message: "Student not found" });
      }

      const isPasswordCorrect = bcrypt.compareSync(password, student.password);
      if (!isPasswordCorrect) {
        return res.json({ message: "Incorrect password" });
      }

      const studentData = {
        studentId: student.studentId,
        name: student.name,
        address: student.address,
        year: student.year,
        nic: student.nic,
        birthday: student.birthday,
        gender: student.gender,
        email: student.email,
        phonenumber: student.phonenumber,
      };

      const token = jwt.sign({ sub: student._id, ...studentData }, process.env.JWT_KEY, { expiresIn: "7d" });

      return res.json({ message: "Login successful", token, student: studentData });
    })
    .catch(() => res.status(500).json({ message: "Login failed" }));
}
export async function getMe(req, res) {
  try {
    const id = req.user?.sub; // token payload: sub = student._id
    if (!id) return res.status(401).json({ message: "Unauthenticated" });
    const student = await Student.findById(id);
    if (!student) return res.status(404).json({ message: "Student not found" });
    return res.json(student);
  } catch (e) {
    return res.status(500).json({ message: "Error fetching profile" });
  }
}
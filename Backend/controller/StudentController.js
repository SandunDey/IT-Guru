import Student from "../model/Student.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();

export async function saveStudent(req, res) {
  try {
    const {
      studentId,
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

    // 1) validate password match BEFORE hashing
    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ message: "Password and Confirm Password do not match" });
    }

    // 2) hash
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    // 3) create & save
    const student = new Student({
      studentId,
      name,
      address,
      year,          // Number (see model)
      nic,
      birthday,
      gender,
      email,
      password: hashedPassword,
      phonenumber,
         // String (see model)
    });

    await student.save();

    return res.status(201).json({
      message: "Student saved successfully",
      student,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error saving student",
      error: err.message,
    });
  }
}

export function getAllStudents(req, res) {
  Student.find()
    .then((students) => res.json(students))
    .catch(() =>
      res.status(500).json({
        message: "Error searching students",
      })
    );
}

export function updateStudent(req, res) {
  Student.findOneAndUpdate({ studentId: req.params.studentId }, req.body, {
    new: true,
  })
    .then((student) => {
      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }
      return res.json({ message: "Student updated successfully", student });
    })
    .catch(() =>
      res.status(500).json({
        message: "Error updating student",
      })
    );
}

export function deleteStudent(req, res) {
  // NOTE: If you add auth later, enforce it here.
  Student.findOneAndDelete({ studentId: req.params.studentId })
    .then((student) => {
      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }
      return res.json({ message: "Student deleted successfully" });
    })
    .catch(() =>
      res.status(500).json({
        message: "Error deleting student",
      })
    );
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

      // never put hashed password in token payload sent back
      const studentData = {
        studentId: student.studentId,
        name: student.name,
        address: student.address,
        year: student.year,
        nic: student.nic,          // fixed from student.name
        birthday: student.birthday,
        gender: student.gender,
        email: student.email,
        phonenumber: student.phonenumber,
      };

      const token = jwt.sign({ sub: student._id, ...studentData }, process.env.JWT_KEY, {
        expiresIn: "7d",
      });

      return res.json({
        message: "Login successful",
        token,
        student: studentData,
      });
    })
    .catch(() =>
      res.status(500).json({
        message: "Login failed",
      })
    );
}

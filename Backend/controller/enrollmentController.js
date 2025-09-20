import Counter from "../model/counter.js";
import Enrollment from "../model/enroll.js";
import Student from "../model/Student.js";
import mongoose from "mongoose"; // if not already imported

export async function createEnrollment(req, res) {
    const { studentID, classYear, enrollmentKey } = req.body;

    // Ensure student can only enroll in their own year
    const student = await Student.findOne({ studentId: studentID });
    if (!student) {
        return res.status(404).json({ message: "Student not found" });
    }
    //  Ensure student year matches class year
    if (student.year + " A/L" !== classYear) {
        return res.status(400).json({
            message: "Student year does not match the selected class year",
        });
    }
    //  Ensure enrollment key is valid
    if (student.studentId !== enrollmentKey) {
        return res.status(400).json({ message: "Invalid enrollment key" });
    }

    //  Prevent duplicate enrollment
    const alreadyEnrolled = await Enrollment.findOne({ studentId: student._id });
    if (alreadyEnrolled) {
        return res.status(200).json({
            message: "Student already enrolled",
            enrollment: alreadyEnrolled,
            alreadyEnrolled: true
        });
    }

    //Generate auto increment Enrollment ID
    let counter = await Counter.findOne({ id: "enrollmentID" });
    if (!counter) {
        counter = new Counter({ id: "enrollmentID", seq: 0 });
        await counter.save();
    }
    counter.seq += 1;
    await counter.save();

    const newEnrollmentID = "ENR" + counter.seq.toString().padStart(3, "0"); // ENR001, ENR002

    const enrollment = new Enrollment({
        enrollmentID: newEnrollmentID,
        studentId: student._id,
        classYear,
        enrollmentKey,
        paymentStatus: "succeeded",
        isActive: true,
        year: student.year,

    });

    try {
        await enrollment.save();
        res.json({ message: "Enrollment created successfully", enrollment }); // ✅ FIX: return created enrollment for easier debugging
    } catch (err) {
        console.error(" Enrollment creation error:", err); //  FIX: more descriptive log
        res.status(500).json({ message: "Failed to create enrollment", error: err.message }); // ✅ FIX: send actual error to frontend
    }
}

export function getEnrollmentByYear(req, res) {
    const classYear = req.params.classYear.replace(/-/g, "/"); // convert 2026A-L -> 2026A/L

    Enrollment.find({ classYear })
        .then((enrollment) => {
            if (enrollment.length == 0) {
                return res.status(404).json({ message: "No enrollments found for this year" });
            }
            res.json(enrollment);
        })
        .catch(() => {
            res.status(500).json({ message: "Error fetching enrollments by year" });
        });
}

// GET all enrollments with student info
export async function getAllEnrollment(req, res) {
    try {
        const enrollments = await Enrollment.find()
            .populate("studentId", "studentId year name"); // populate only the fields you need
        res.json(enrollments);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to retrieve Enrollment" });
    }
}

export async function deleteEnrollment(req, res) {
    // if (!isAdmin(req)) {
    //     res.status(403).json({ message: "You are not authorized to delete Enrollment" });
    //     return;
    // }
    try {
        const { enrollmentID } = req.params;
        const result = await Enrollment.findOneAndDelete({ enrollmentID });
        if (!result) {
            return res.status(404).json({ message: "Enrollment not found" });
        }
        res.json({ message: "Enrollment deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Failed to delete Enrollment", error: err.message });
    }
}

export async function updateEnrollment(req, res) {
    // if (!isAdmin(req)) {
    //     res.status(403).json({ message: "You are not authorized to update Enrollment" });
    //     console.log(res.data);
    //     return;
    // }

    try {
        const enrollmentID = req.params.enrollmentID;
        const { paymentStatus, isActive, year, enrollmentDate } = req.body;

        // validate isActive properly
        if (typeof isActive !== "boolean") {
            return res.status(400).json({ message: "Invalid active status value" });
        }

        const updated = await Enrollment.findOneAndUpdate(
            { enrollmentID },
            {
                paymentStatus,
                isActive,
                year,
                enrollmentDate,
            },
            { new: true } // return updated doc
        );

        if (!updated) {
            return res.status(404).json({ message: "Enrollment not found" });
        }

        res.json({ message: "Enrollment updated successfully", enrollment: updated });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to update Enrollment", error: err.message });
    }
}

export function isAdmin(req) {
    if (req.user == null) return false;
    if (req.user.role != "admin") return false;
    return true;
}

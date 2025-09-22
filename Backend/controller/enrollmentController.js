import Counter from "../model/counter.js";
import Enrollment from "../model/enroll.js";
import Student from "../model/Student.js";
import mongoose from "mongoose";

export async function createEnrollment(req, res) {
    const { studentID, classYear, enrollmentKey } = req.body; // Extract fields(studentID, classYear, enrollmentKey) from request body

    // Ensure student can only enroll in their own year
    const student = await Student.findOne({ studentId: studentID });// check using student id the student exist in db
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

    //Generate auto increment Enrollment ID use Counter model
    let counter = await Counter.findOne({ id: "enrollmentID" });
    if (!counter) {
        counter = new Counter({ id: "enrollmentID", seq: 0 });// counter ekak nathnm new counter ekak hdanva
        await counter.save();// counter save venakam innva
    }
    counter.seq += 1;//counter increase
    await counter.save();// update counter save

    const newEnrollmentID = "ENR" + counter.seq.toString().padStart(3, "0"); // Enrollment ID generate karanawa (ENR001)

    const enrollment = new Enrollment({
        enrollmentID: newEnrollmentID,//add auto generate enrollment id
        studentId: student._id,// Student id student reference
        classYear,
        enrollmentKey,
        paymentStatus: "succeeded",
        isActive: true,
        year: student.year,// Student year

    });

    try {
        await enrollment.save();// save db
        res.json({ message: "Enrollment created successfully", enrollment }); // return created enrollment 
    } catch (err) {
        console.error(" Enrollment creation error:", err);
        res.status(500).json({ message: "Failed to create enrollment", error: err.message }); //send actual error to frontend
    }
}

export function getEnrollmentByYear(req, res) {
    const classYear = req.params.classYear.replace(/-/g, "/"); //request para convert 2026A-L -> 2026A/L

    Enrollment.find({ classYear })//enrollment eka hoyanava year ekat
        .then((enrollment) => {//hoyagaththoth
            if (enrollment.length == 0) {//enrollment data nathnm
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
            .populate("studentId", "studentId year name"); // studentId field ekata link wela thiyena Student collection eken data fetch karanawa.
        res.json(enrollments);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to retrieve Enrollment" });
    }
}

export async function deleteEnrollment(req, res) {
    if (!isAdmin(req)) {
        res.status(403).json({ message: "You are not authorized to delete Enrollment" });
        return;
    }
    try {
        const { enrollmentID } = req.params;//URL parameter ekedi thiyena enrollmentID extract karala id eka vitrak gannva
        const result = await Enrollment.findOneAndDelete({ enrollmentID });//findOneAndDelete → first matching document delete karanawa
        if (!result) {
            return res.status(404).json({ message: "Enrollment not found" });
        }
        res.json({ message: "Enrollment deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Failed to delete Enrollment", error: err.message });
    }
}

export async function updateEnrollment(req, res) {
    if (!isAdmin(req)) {
        res.status(403).json({ message: "You are not authorized to update Enrollment" });
        console.log(res.data);
        return;
    }

    try {
        const enrollmentID = req.params.enrollmentID;//url parameter eke thiyena enrollment id eka gannava
        const { paymentStatus, isActive, year, enrollmentDate } = req.body;//frontend ekem yawan update data vala avashsha data tika vitrak extract karagannva

        // validate isActive properly
        if (typeof isActive !== "boolean") {//isactive eke type ek boolean nemenm
            return res.status(400).json({ message: "Invalid active status value" });
        }

        const updated = await Enrollment.findOneAndUpdate(// first matching enrollment id eka update karanava
            { enrollmentID },
            {
                paymentStatus,
                isActive,
                year,
                enrollmentDate,
            },
            { new: true } // return updated document
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

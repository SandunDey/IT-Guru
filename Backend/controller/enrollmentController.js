import Enrollment from "../model/enroll.js";

export async function createEnrollment(req, res) {
    const { studentID, classYear, enrollmentKey } = req.body;

    // Ensure student can only enroll in their own year
    const student = await Student.findOne({ studentId: studentID });
    if (!student) {
        return res.status(404).json({ message: "Student not found" });
    }

    if (student.year + " A/L" !== classYear) {
        return res.status(400).json({
            message: "Student year does not match the selected class year",
        });
    }

    if (student.studentId !== enrollmentKey) {
        return res.status(400).json({ message: "Invalid enrollment key" });
    }

    const enrollment = new Enrollment({
        enrollmentID: new mongoose.Types.ObjectId(), // generate unique ID
        studentId: student._id,
        classYear,
        enrollmentKey,
        paymentStatus: "UNPAID",
        isActive: true,
    });

    try {
        await enrollment.save();
        res.json({ message: "Enrollment created successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to create enrollment" });
    }
}


export function getEnrollmentByYear(req, res) {

    const classYear = req.params.classYear.replace(/-/g, "/"); // convert 2026A-L -> 2026A/L

    Enrollment.find({ classYear })//me id ekt gelapena 1kenek innvd kiyala check karanava findone ekem
        .then(
            (enrollment) => {//e email ekt user kenek hamba unad kiyala balann ona
                if (enrollment.length == 0) {
                    res.status(404).json(
                        {
                            message: "No enrollments found for this year"
                        }
                    )

                }
                res.json(enrollment);

            }).catch(() => {
                res.status(500).json(
                    {
                        message: "Error fetching enrollments by year"
                    }
                )
            })
}

export async function getAllEnrollment(req, res) {
    try {
        const enrollment = await Enrollment.find()
        res.json(enrollment);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Failed to retrieve Enrollment",
        });
    }
}

export async function deleteEnrollment(req, res) {
    if (!isAdmin(req)) {
        res.status(403).json({
            message: "You are not authorized to delete Enrollment"
        });
        return;
    }
    try {

        const { enrollmentID } = req.params;


        await Enrollment.deleteOne({ enrollmentID })

        res.json({
            message: "Enrollment deleted successfully"
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Failed to delete Enrollment",
        });
    }
}

export async function updateEnrollment(req, res) {
    if (!isAdmin(req)) {
        res.status(403).json({
            message: "You are not authorized to update Enrollment"
        });
        return;
    }

    try {
        const { isActive } = req.body;

        const enrollmentID = req.params.enrollmentID;

        if (typeof isActive !== "boolean") {
            return (
                res.status(400).json(
                    {
                        message: "Invalid active status value"
                    }
                ))
        }

        const updatedData = { isActive };

        await Enrollment.updateOne(
            { enrollmentID: enrollmentID },
            updatedData
        );

        res.json({
            message: "Enrollment updated successfully"
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Failed to update Enrollment",
        });
    }
}


export function isAdmin(req) {

    if (req.user == null) {
        return false;
    }
    if (req.user.role != "admin") {
        return false;
    }
    return true;

}
import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema(
    {

        enrollmentID: {
            type: String,
            require: true,
            unique: true
        },

        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true,
            unique: true,
        },


        classYear: {
            type: String,
            require: true
        },

        year: {
            type: Number,
            required: true,
            min: 2025,
        },

        enrollmentKey: {
            type: String,
            require: true
        },

        paymentStatus: {
            type: String,
            enum: ["pending", "succeeded", "failed", "refunded", "cancelled"],
            index: true,
            default: "succeeded"
        },

        isActive: {
            type: Boolean,
            default: false
        },

        enrollmentDate: {
            type: Date,
            default: Date.now
        },
    },
    { timestamps: true }
)

enrollmentSchema.methods.canEnroll = function (studentYear) {
    return (
        this.classYear == studentYear &&
        this.enrollmentKey == this.studentId &&
        this.paymentStatus == "PAID" &&
        this.isActive
    )
}

const Enrollment = mongoose.model("Enrollment", enrollmentSchema)

export default Enrollment;
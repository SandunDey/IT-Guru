import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema(// Create new schema
    {

        enrollmentID: {
            type: String,
            require: true,
            unique: true
        },

        studentId: {
            type: mongoose.Schema.Types.ObjectId,// Reference to another document in mongo db (ObjectId)
            ref: "Student",// Refers to Student module
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
            min: 2025,// Minimum year 2025
        },

        enrollmentKey: {
            type: String,
            require: true
        },

        paymentStatus: {
            type: String,
            enum: ["pending", "succeeded", "failed", "refunded", "cancelled"],
            // index: true,
            default: "succeeded"
        },

        isActive: {
            type: Boolean,
            default: false
        },

        enrollmentDate: {
            type: Date,
            default: Date.now// Default current date/time
        },
    },
    { timestamps: true }// Auto add createdAt & updatedAt
)

// Define a method "canEnroll" inside schema
enrollmentSchema.methods.canEnroll = function (studentYear) {
    return (
        this.classYear == studentYear &&// Must match class year
        this.enrollmentKey == this.studentId &&// Enrollment key must equal studentId
        this.paymentStatus == "PAID" &&// Payment must be "PAID"
        this.isActive // Enrollment must be active
    )
}

const Enrollment = mongoose.model("Enrollment", enrollmentSchema)

export default Enrollment;
import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema(
    {
        
       enrollmentID :{
        type : String,
        require : true,
        unique : true
       },

       studentID :{
        type : String,
        require : true
        
       },

       classYear : {
        type : String,
        require : true
       },

       studentYear : {
        type : String,
        require : true
       },

       enrollmentKey : {
        type : String,
        require : true
       },

       paymentStatus : {
        type : String,
        enum: ["PAID", "UNPAID"],
        default: "UNPAID"
       },

       isActive : {
        type : Boolean,
        default : false 
       },

       enrollmentDate : {
        type : Date,
        default: Date.now
       },
    },
    { timestamps: true }
)

enrollmentSchema.methods.canEnroll = function(studentYear){
    return(
        this.classYear == studentYear &&
        this.enrollmentKey == this.studentID &&
        this.paymentStatus == "PAID" &&
        this.isActive
    )
}

const Enrollment =  mongoose.model("Enrollment", enrollmentSchema)

export default Enrollment;
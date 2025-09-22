import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
studentId: {
  type: String,
  unique: true,
  trim: true,
  default: () => `STU-${Date.now()}`
},
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },

  // ✅ store academic year as a Number (not Date)
  year: {
    type: String,
    required: true,
    
  },

  nic: {
    type: String,
    required: true,

    trim: true,
    uppercase: true,
    index: true,
    match: [/^([0-9]{9}[VX]|[0-9]{12})$/, "Invalid NIC format"],
  },

  birthday: {
    type: Date,
    min: "1900-01-01",
    max: Date.now, // ok: Mongoose treats this as now
  },

  gender: {
    type: String,
    required: true,
    enum: ["Male", "Female", "Other"],
    trim: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, "Invalid email address"],
  },

  password: {
    type: String,
    required: true,
  },

  // ❌ do not persist confirmPassword
  // confirmPassword: { type: String }

  // ✅ phone number as String so regex works as intended
  phonenumber: {
    type: String,
    required: true,

    trim: true,
    match: [/^\+?[0-9]{10,15}$/, "Invalid phone number"],
  },
    role:{
        type:String,
        required:true,
        default:"student"

    }
});

const Student = mongoose.model("Student", studentSchema);
export default Student;

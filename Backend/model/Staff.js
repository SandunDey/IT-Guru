import mongoose from "mongoose";

const staffShema = new mongoose.Schema({
    staffId:{
        type:String,
        required:true,
        unique: true,
        trim: true,

    },
    name:{
        type:String,
        required:true,
        
    },
    address:{
        type:String,
        required:true,
    },
  
    nic:{
        type: String,
        required: true,
        unique: true,
        trim: true,
        uppercase: true,
        index: true,
        match: [/^([0-9]{9}[VX]|[0-9]{12})$/, "Invalid NIC format"], 
    },
  
    gender:{
        type:String,
        required: true,
        enum: ['Male', 'Female', 'Other'], 
        trim: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Invalid email address'],
        
    },
    password:{
        type:String,
        required:true,

    },
    confirmPassword:{
        type:String,
        

    },
    phonenumber:{
        type:Number,
        required: true,
        unique: true,
        trim: true,
        match: [/^\+?[0-9]{10,15}$/, 'Invalid phone number'], 
    },
    role:{
        type:String,
        required:true,
        default:"staff"

    }

})
const Staff=mongoose.model("Staff",staffShema) 
export default Staff;
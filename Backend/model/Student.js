import mongoose from 'mongoose'

const studentShema = new mongoose.Schema({
    studentId:{
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
    year:{
        type:Date,
        required:true,
        min: 2025,
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
    birthday:{
        type:Date,
        min: '1900-01-01',
        max: Date.now, 
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
    }

})
const Student=mongoose.model("Student",studentShema) 
export default Student;
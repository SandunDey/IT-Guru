import mongoose from 'mongoose'

const teachernShema = new mongoose.Schema({

    name:{
        type:String,
        required:true,
        
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
        default:"teacher"

    }

})
const Teacher=mongoose.model("Teacher",teachernShema) 
export default Teacher;
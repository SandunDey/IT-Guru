import mongoose from "mongoose";
import generateID from "../utils/idGenerator.js"

const timetableSchema = new mongoose.Schema({
  timetableID: {
    type: String,
    unique: true,
    default : function () {
        return "TT" + generateID()
    }
  },
  year: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required:true

  },
  startTime: {
    type: String,
    required:true
  },
  endTime:{
    type: String,
    required: true
  }
  ,
  subject: {
    type: String, 
    required: true
  },
  link: {
    type: String,
    required: true
  },
  isPublished: {//allows you to control which timetables students see without deleting anything 
    type: Boolean,//false unot studentslata e timetable ek penne na ,but not deleted
    default: true
  },
  createdAt: {//timetable ek create krpu welawa auto watenna
    type: Date,
    default: Date.now
  },
  updatedAt: {//TT ek update krot krpu welawa watenw
    type: Date,
    default: Date.now
  }
})

const Timetable = mongoose.model("Timetable", timetableSchema);//create model
export default Timetable;
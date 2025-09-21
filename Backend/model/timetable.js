import mongoose from "mongoose";
import Counter from './counter.js';

const timetableSchema = new mongoose.Schema({
  TimetableID: {
    type: String,
    unique: true,
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
  isPublished: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
})
timetableSchema.pre("save",async function(next){
  if(this.isNew){
    const counter = await Counter.findByIdAndUpdate(
      {_id:'TimetableID'},
      {$inc:{ seq:1 }},
      {new : true, upsert:true}

    );
    this.TimetableID = `timeTable${counter.seq}`;
  }
  next()
});



const Timetable = mongoose.model("Timetable", timetableSchema);
export default Timetable;
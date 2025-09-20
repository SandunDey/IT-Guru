import mongoose from "mongoose";

const announcementschema = new mongoose.Schema(
    {
        announcementID :{
            type: String,
            required: true,
            unique: true
        },
        title : {
            type:String,
            required : true
        },
        description : {
            type:String,
            required : true,
        },
        type : {
            type : String,
            enum:["Academic","Payment","Event","System", "General"],
            required : true
        },
        audience : {
            type : [String],// Using an array here lets us select multiple audiences at once
            enum:["Student","Parent","Teacher","Staff"],
            required:true
        },
        expiryDate : {
            type : Date,
            required : true
        }
    },

    {
        timestamps : true
    }
)

const Announcement = mongoose.model("Announcement", announcementschema)
export default Announcement
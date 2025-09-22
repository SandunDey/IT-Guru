import mongoose from "mongoose";// mongoose modele ekem mongoose DB data hadann ona libry ek import karanva

const announcementschema = new mongoose.Schema(//new mongoose schema class create
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
            enum:["Academic","Payment","Event","System", "General"], // predefined list ekakinma denna puluwan
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
        timestamps : true// createdAt saha updatedAt fields automaticma database eke add wenawa
    }
)

const Announcement = mongoose.model("Announcement", announcementschema)//mongoose eke model ekk hadanva model name and schema name dala 
export default Announcement // nexport model
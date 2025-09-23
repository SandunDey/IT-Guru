import express from 'express';// express module ekem Express.js framework eka import karanva
import { createAnnouncement, deleteAnnouncement, getAnnouncement, getAnnouncementID, updateAnnouncement } from '../controller/announcementController.js';


const announcementRouter = express.Router();//Express eke router object ekak hadanawa (routes manage karanna)

announcementRouter.get("/", getAnnouncement)// get request handle 
announcementRouter.post("/", createAnnouncement)
announcementRouter.delete("/:announcementID", deleteAnnouncement);// "/:announcementID" = URL parameter ekak (announcementID variable ekata yanawa)(dynamic ID, ex: /announcement/ANN001 → req.params.announcementID = "ANN001")
announcementRouter.put("/:announcementID", updateAnnouncement)
announcementRouter.get("/:announcementID", getAnnouncementID)




export default announcementRouter;
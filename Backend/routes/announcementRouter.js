import express from 'express';
import { createAnnouncement, deleteAnnouncement, getAnnouncement, getAnnouncementID, updateAnnouncement } from '../controller/announcementController.js';


const announcementRouter = express.Router();

announcementRouter.get("/", getAnnouncement)
announcementRouter.post("/", createAnnouncement)
announcementRouter.delete("/:announcementID", deleteAnnouncement);
announcementRouter.put("/:announcementID", updateAnnouncement)
announcementRouter.get("/:announcementID", getAnnouncementID)




export default announcementRouter;
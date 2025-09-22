import Announcement from "../model/announcement.js";
import { isAdmin } from "./adminController.js";

export async function createAnnouncement(req, res) {

    if (!isAdmin(req)) {
        res.status(403).json({
            message: "You are not authorized to create an Announcement"
        });
        return;// Stop function execution
    }

    try {

        const announcementData = req.body;//request body ekem announcement details gannva

        const announcement = new Announcement(announcementData);// gaththa announcement data valim new announcement object ekk hadanva

        await announcement.save();// Save the new announcement to the database

        res.json({
            message: "Announcement created successfully",
            announcement: announcement, // save announcement ekath ekk success ek yavanne
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Failed to create an Announcement",
        });
    }
}

export async function getAnnouncement(req, res) {
    try {
        const announcements = await Announcement.find()//database ekem all announcement gannva
        res.json(announcements);// ganna announcements response ekk vidiyt send karanva
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Failed to retrieve an Announcement",
        });
    }
}

export async function deleteAnnouncement(req, res) {

    if (!isAdmin(req)) {
        res.status(403).json({
            message: "You are not authorized to delete an Announcement"
        });
        return;
    }
    try {

        const announcementID = req.params.announcementID // Get announcementID from URL parameter



        await Announcement.deleteOne({
            announcementID: announcementID
        })//announcement ID ekt adalv DB ekem delete karanva

        res.json({
            message: "Announcement deleted successfully"
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Failed to delete Announcement",
        });
    }
}

export async function updateAnnouncement(req, res) {
    if (!isAdmin(req)) {
        res.status(403).json({
            message: "You are not authorized to update an Announcement"
        });
        return;
    }

    try {
        const announcementID = req.params.announcementID;

        const updatedData = req.body;

        await Announcement.updateOne(
            { announcementID: announcementID },
            updatedData
        );// Update announcement in DB using ID

        res.json({
            message: "Announcement updated successfully"
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Failed to update Announcement",
        });
    }
}

export async function getAnnouncementID(req, res) {
    try {
        const announcementID = req.params.announcementID;

        const announcement = await Announcement.findOne(
            {
                announcementID: announcementID
            }
        )// Find one announcement by ID
        if (announcement == null) {// no anno: found
            res.status(404).json({
                message: "Announcement not found"
            });
        } else {
            res.json(announcement); // Send found announcement
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Failed to retrieve announcement by ID",
        });
    }
}

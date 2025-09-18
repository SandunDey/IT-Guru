import Announcement from "../model/announcement.js";
import { isAdmin } from "./adminController.js";

export async function createAnnouncement(req, res) {

    if (!isAdmin(req)) {
        res.status(403).json({
            message: "You are not authorized to create an Announcement"
        });
        return;
    }

    try {

        const announcementData = req.body;

        const announcement = new Announcement(announcementData);

        await announcement.save();

        res.json({
            message: "Announcement created successfully",
            announcement: announcement,
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
        const announcements = await Announcement.find()
        res.json(announcements);
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

        const announcementID = req.params.announcementID


        await Announcement.deleteOne({
            announcementID: announcementID
        })

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
        );

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
        )
        if (announcement == null) {
            res.status(404).json({
                message: "Announcement not found"
            });
        } else {
            res.json(announcement);
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Failed to retrieve announcement by ID",
        });
    }
}

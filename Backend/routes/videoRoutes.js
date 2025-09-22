// routes/videoRoutes.js
import { Router } from "express";
import {
  listVideos, getVideo, createVideo, updateVideo, deleteVideo, setPublished
} from "../controller/videoController.js";

const router = Router();

router.get("/", listVideos);
router.get("/:id", getVideo);
router.post("/", createVideo);
router.patch("/:id", updateVideo);
router.delete("/:id", deleteVideo);
router.patch("/:id/publish", setPublished);

export default router;

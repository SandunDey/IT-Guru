// Backend/routes/materialRoutes.js
import { Router } from "express";
import Material from "../model/Material.js";

const router = Router();

// GET /api/materials
router.get("/", async (req, res, next) => {
  try {
    const items = await Material.find().sort({ createdAt: -1 });
    res.json({ data: items });
  } catch (e) { next(e); }
});

// POST /api/materials
router.post("/", async (req, res, next) => {
  try {
    const body = req.body || {};
    if (!body.title) return res.status(400).json({ message: "title is required" });

    // ensure mid exists (frontend also sends, this is extra safety)
    if (!body.mid) {
      body.mid = `mat_${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`;
    }

    const doc = await Material.create(body);
    res.status(201).json({ data: doc });
  } catch (e) { next(e); }
});

// PATCH /api/materials/:id
router.patch("/:id", async (req, res, next) => {
  try {
    const doc = await Material.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!doc) return res.status(404).json({ message: "not found" });
    res.json({ data: doc });
  } catch (e) { next(e); }
});

// DELETE /api/materials/:id
router.delete("/:id", async (req, res, next) => {
  try {
    await Material.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (e) { next(e); }
});

export default router;

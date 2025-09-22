// controllers/videoController.js
import Video from "../model/Video.js";

const buildFilter = (q) => {
  const f = {};
  if (q.batch && q.batch !== "All Batches") f.batch = q.batch;
  if (q.published === "true")  f.published = true;
  if (q.published === "false") f.published = false;
  if (q.q) {
    const rx = new RegExp(q.q.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    f.$or = [{ title: rx }, { url: rx }];
  }
  return f;
};

export const listVideos = async (req, res, next) => {
  try {
    const { page = 1, limit = 50, sort = "-createdAt" } = req.query;
    const filter = buildFilter(req.query);
    const skip = (Number(page) - 1) * Number(limit);
    const [items, total] = await Promise.all([
      Video.find(filter).sort(sort).skip(skip).limit(Number(limit)),
      Video.countDocuments(filter),
    ]);
    res.json({ ok: true, data: items, meta: { total, page: Number(page), pages: Math.ceil(total/Number(limit)) } });
  } catch (e) { next(e); }
};

export const getVideo = async (req, res, next) => {
  try {
    const doc = await Video.findById(req.params.id);
    if (!doc) return res.status(404).json({ ok:false, message:"Not found" });
    res.json({ ok:true, data: doc });
  } catch (e) { next(e); }
};

export const createVideo = async (req, res, next) => {
  try {
    const doc = await Video.create(req.body);
    res.status(201).json({ ok:true, data: doc });
  } catch (e) { next(e); }
};

export const updateVideo = async (req, res, next) => {
  try {
    const doc = await Video.findByIdAndUpdate(req.params.id, req.body, { new:true, runValidators:true });
    if (!doc) return res.status(404).json({ ok:false, message:"Not found" });
    res.json({ ok:true, data: doc });
  } catch (e) { next(e); }
};

export const deleteVideo = async (req, res, next) => {
  try {
    const doc = await Video.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ ok:false, message:"Not found" });
    res.json({ ok:true, message:"Deleted" });
  } catch (e) { next(e); }
};

export const setPublished = async (req, res, next) => {
  try {
    const doc = await Video.findById(req.params.id);
    if (!doc) return res.status(404).json({ ok:false, message:"Not found" });
    const { published } = req.body; // boolean or undefined -> toggle
    doc.published = typeof published === "boolean" ? published : !doc.published;
    await doc.save();
    res.json({ ok:true, data: doc });
  } catch (e) { next(e); }
};

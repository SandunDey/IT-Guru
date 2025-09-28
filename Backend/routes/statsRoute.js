// routes/statsRoute.js
import express from "express";
import Admin from "../model/Admin.js";
import Student from "../model/Student.js";
import Teacher from "../model/Teacher.js";

const router = express.Router();

// GET /api/stats/overview
router.get("/overview", async (_req, res) => {
  try {
    const [admins, students, teachers] = await Promise.all([
      Admin.countDocuments(),
      Student.countDocuments(),
      Teacher.countDocuments(),
    ]);

    res.json({
      admins,
      students,
      teachers,
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching stats", error: err.message });
  }
});

// GET /api/stats/monthly
router.get("/monthly", async (_req, res) => {
  try {
    const models = { admins: Admin, students: Student, teachers: Teacher };
    const monthly = {};

    for (const [key, Model] of Object.entries(models)) {
      const data = await Model.aggregate([
        {
          $group: {
            _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
            count: { $sum: 1 },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ]);

      monthly[key] = data.map((d) => ({
        month: `${d._id.year}-${String(d._id.month).padStart(2, "0")}`,
        count: d.count,
      }));
    }

    res.json(monthly);
  } catch (err) {
    res.status(500).json({ message: "Error fetching monthly stats", error: err.message });
  }
});

export default router;

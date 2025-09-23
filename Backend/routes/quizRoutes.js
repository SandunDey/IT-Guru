// routes/quizRoutes.js
import express from "express";
import {
  listQuizzes, createQuiz, updateQuiz, deleteQuiz, togglePublish,
  getQuizForStudent, submitQuiz, listAttemptsForQuiz,
} from "../controller/quizController.js";

const router = express.Router();

// teacher CRUD
router.get("/", listQuizzes);
router.post("/", createQuiz);
router.patch("/:id", updateQuiz);
router.delete("/:id", deleteQuiz);
router.post("/:id/toggle-publish", togglePublish);

// student

// attempts (teacher)
router.get("/:id/attempts", listAttemptsForQuiz);

router.get("/:id/take", getQuizForStudent);
router.post("/:id/submit", submitQuiz);


export default router;

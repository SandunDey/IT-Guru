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
router.get("/:id/take", getQuizForStudent);  // ?studentId=abc
router.post("/:id/submit", submitQuiz);

// attempts (teacher)
router.get("/:id/attempts", listAttemptsForQuiz);

export default router;

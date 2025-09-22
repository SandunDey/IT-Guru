// controllers/quizController.js
import mongoose from "mongoose";
import Quiz from "../model/quizModel.js";
import QuizAttempt from "../model/quizAttemptModel.js";
import crypto from "crypto";

/* ---------- helpers ---------- */
// deterministic PRNG from seed
function seedRng(seedStr) {
  let seed = crypto.createHash("sha256").update(seedStr).digest().readUInt32BE(0);
  return () => {
    // xorshift32
    seed ^= seed << 13; seed ^= seed >>> 17; seed ^= seed << 5;
    return (seed >>> 0) / 0xFFFFFFFF;
  };
}

function shuffleWithSeed(arr, seedStr) {
  const rng = seedRng(seedStr);
  const a = arr.map((v, i) => ({ v, i }));
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ---------- teacher endpoints ---------- */
export const listQuizzes = async (req, res, next) => {
  try {
    const docs = await Quiz.find().sort({ createdAt: -1 });
    res.json({ data: docs });
  } catch (e) { next(e); }
};

export const createQuiz = async (req, res, next) => {
  try {
    const q = new Quiz(req.body);
    // optional: compute totalMarks if not given
    if (!q.totalMarks || q.totalMarks === 0) {
      q.totalMarks = (q.questions || []).reduce((s, x) => s + (x.marks || 1), 0);
    }
    const saved = await q.save();
    res.status(201).json({ data: saved });
  } catch (e) { next(e); }
};

export const updateQuiz = async (req, res, next) => {
  try {
    const body = req.body || {};
    if (!body.totalMarks && Array.isArray(body.questions)) {
      body.totalMarks = body.questions.reduce((s, x) => s + (x.marks || 1), 0);
    }
    const updated = await Quiz.findByIdAndUpdate(req.params.id, body, { new: true });
    if (!updated) return res.status(404).json({ message: "Not found" });
    res.json({ data: updated });
  } catch (e) { next(e); }
};

export const deleteQuiz = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Optional: guard invalid ObjectId -> 400 instead of 500
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid quiz id" });
    }

    const deleted = await Quiz.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Quiz not found" });

    res.json({ data: true });  // <--- IMPORTANT for frontend
  } catch (err) {
    next(err);
  }
};
export const togglePublish = async (req, res, next) => {
  try {
    const doc = await Quiz.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Not found" });
    doc.published = !doc.published;
    await doc.save();
    res.json({ data: doc });
  } catch (e) { next(e); }
};

/* ---------- student endpoints ---------- */
// GET /api/quizzes/:id/take?studentId=abc
// return SHUFFLED questions + mapping so we can score on server
export const getQuizForStudent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { studentId } = req.query;
    const quiz = await Quiz.findById(id);
    if (!quiz) return res.status(404).json({ message: "Not found" });
    if (!quiz.published) return res.status(403).json({ message: "Quiz not published" });
    if (!studentId) return res.status(400).json({ message: "studentId required" });

    const baseSeed = `${id}|${studentId}`;

    // shuffle questions deterministically
    const qShuffle = shuffleWithSeed(quiz.questions, baseSeed);
    const shuffledQuestions = qShuffle.map(({ v }, idx) => {
      // shuffle options too
      const optShuffle = shuffleWithSeed(v.options, `${baseSeed}|q${idx}`);
      const newOptions = optShuffle.map(({ v: opt }) => opt);
      const correctOrig = v.correctIndex;
      const correctOptOld = v.options[correctOrig].text;
      const newCorrectIndex = newOptions.findIndex(o => o.text === correctOptOld);

      return {
        text: v.text,
        options: newOptions,   // [{text}]
        marks: v.marks || 1,
        // not exposing correctIndex to client
        // keep a mapping by returning the original index for server reference
        __origIndex: qShuffle[idx].i, // original question index
        __correctIndex: newCorrectIndex, // used to verify if client tampers (optional)
      };
    });

    res.json({
      data: {
        _id: quiz._id,
        title: quiz.title,
        subject: quiz.subject,
        batch: quiz.batch,
        schedule: quiz.schedule,
        durationMins: quiz.durationMins,
        totalMarks: quiz.totalMarks,
        questions: shuffledQuestions.map(q => ({
          text: q.text,
          options: q.options,
          marks: q.marks,
          // only send orig index to allow server-side scoring
          idx: q.__origIndex,
        })),
      }
    });
  } catch (e) { next(e); }
};

// POST /api/quizzes/:id/submit  { studentId, answers: [{idx, chosenIndex}] }
export const submitQuiz = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { studentId, answers } = req.body;
    if (!studentId) return res.status(400).json({ message: "studentId required" });
    if (!Array.isArray(answers)) return res.status(400).json({ message: "answers[] required" });

    const quiz = await Quiz.findById(id);
    if (!quiz) return res.status(404).json({ message: "Not found" });

    let score = 0;
    const maxScore = (quiz.questions || []).reduce((s, q) => s + (q.marks || 1), 0);

    const safeAnswers = answers.map(a => {
      const q = quiz.questions[a.idx];
      if (!q) return { qIndex: a.idx, chosenIndex: a.chosenIndex, isCorrect: false, marksAwarded: 0 };
      const isCorrect = Number(a.chosenIndex) === Number(q.correctIndex);
      const marksAwarded = isCorrect ? (q.marks || 1) : 0;
      if (isCorrect) score += marksAwarded;
      return { qIndex: a.idx, chosenIndex: a.chosenIndex, isCorrect, marksAwarded };
    });

    const attempt = await QuizAttempt.findOneAndUpdate(
      { quizId: id, studentId },
      {
        $set: {
          submittedAt: new Date(),
          score,
          maxScore,
          answers: safeAnswers,
        },
        $setOnInsert: {
          startedAt: new Date(),
        },
      },
      { new: true, upsert: true }
    );

    res.json({ data: { score, maxScore, attemptId: attempt._id } });
  } catch (e) { next(e); }
};

// teacher view attempts summary
export const listAttemptsForQuiz = async (req, res, next) => {
  try {
    const { id } = req.params;
    const items = await QuizAttempt.find({ quizId: id }).sort({ createdAt: -1 });
    res.json({ data: items });
  } catch (e) { next(e); }
};

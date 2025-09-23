import express from 'express';
import {
  addTestMarks,
  getStudentTestMarks,
  getTestAnalysis,
  updateTestMarks,
  deleteTestMarks
} from '../controller/testMarkController.js';

const router = express.Router();

router.post('/testmarks', addTestMarks);
router.get('/testmarks/student/:studentId', getStudentTestMarks);
router.get('/testmarks/analysis/:studentId', getTestAnalysis);
router.put('/testmarks/:id', updateTestMarks);
router.delete('/testmarks/:id', deleteTestMarks);

export default router;
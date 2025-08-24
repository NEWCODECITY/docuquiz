// const Quiz = require('../models/Quiz');
// const express = require('express');
// const multer = require('multer');
// const pdfParse = require('pdf-parse');
// const summarizeWithMistral = require('../utils/summarizeWithMistral');
// const generateQuizWithMistral = require('../utils/generateQuizWithMistral');
// const QuizResult = require('../models/QuizResult');

// const router = express.Router();
// const upload = multer({ storage: multer.memoryStorage() });

// // Route: Summarize PDF
// router.post('/summarize', upload.single('pdf'), async (req, res) => {
//   try {
//     if (!req.file || !req.file.buffer) {
//       return res.status(400).json({ error: 'PDF file is required.' });
//     }

//     const pdfData = await pdfParse(req.file.buffer);
//     const summary = await summarizeWithMistral(pdfData.text);
//     res.json({ summary });
//   } catch (error) {
//     console.error('Mistral summarization error:', error);
//     res.status(500).json({ error: 'Failed to summarize using Mistral.' });
//   }
// });

// // Route: Generate Quiz and Save with quizId
// router.post('/generate-quiz', async (req, res) => {
//   try {
//     const { summary } = req.body;

//     if (!summary) {
//       return res.status(400).json({ error: 'Summary is required to generate quiz.' });
//     }

//     const quizQuestions = await generateQuizWithMistral(summary);

//     const newQuiz = new Quiz({
//       summary,
//       questions: quizQuestions,
//     });

//     await newQuiz.save();

//     res.status(201).json({ quizId: newQuiz._id, quiz: quizQuestions });
//   } catch (error) {
//     console.error('Quiz generation error:', error);
//     res.status(500).json({ error: 'Failed to generate and save quiz.' });
//   }
// });


// // Route: Save Quiz Result
// // routes/pdfRoutes.js
// // Route: Save Quiz Result (less strict validation)
// router.post('/save-quiz', async (req, res) => {
//   try {
//     const { quizId, userId, score, total, summary, questions } = req.body;

//     // Only check the bare minimum fields
//     if (!quizId || !userId || typeof score !== 'number' || typeof total !== 'number') {
//       return res.status(400).json({ error: 'quizId, userId, score, and total are required.' });
//     }

//     const newResult = new QuizResult({
//       quizId,
//       userId,
//       score,
//       total,
//       summary: summary || '', // Optional
//       questions: questions || [] // Optional
//     });

//     await newResult.save();

//     res.status(201).json({ message: 'Quiz result saved successfully.' });
//   } catch (error) {
//     console.error('Error saving quiz result:', error);
//     res.status(500).json({ error: 'Failed to save quiz result.' });
//   }
// });


// module.exports = router;
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const summarizeWithMistral = require('../utils/summarizeWithMistral');
const generateQuizWithMistral = require('../utils/generateQuizWithMistral');

const QuizResult = require('../models/QuizResult');
const Quiz = require('../models/Quiz');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

/**
 * Route: Summarize PDF
 */
router.post('/summarize', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ error: 'PDF file is required.' });
    }

    const pdfData = await pdfParse(req.file.buffer);
    const summary = await summarizeWithMistral(pdfData.text);

    res.json({ summary });
  } catch (error) {
    console.error('Mistral summarization error:', error);
    res.status(500).json({ error: 'Failed to summarize using Mistral.' });
  }
});

/**
 * Route: Generate Quiz from Summary and Save
 */
router.post('/generate-quiz', async (req, res) => {
  try {
    const { summary } = req.body;

    if (!summary) {
      return res.status(400).json({ error: 'Summary is required to generate quiz.' });
    }

    const quizQuestions = await generateQuizWithMistral(summary);

    const newQuiz = new Quiz({
      summary,
      questions: quizQuestions,
    });

    await newQuiz.save();

    res.status(201).json({ quizId: newQuiz.quizId, quiz: quizQuestions }); // Return UUID, not _id
  } catch (error) {
    console.error('Quiz generation error:', error);
    res.status(500).json({ error: 'Failed to generate and save quiz.' });
  }
});

/**
 * Route: Save Quiz Result
 */
router.post('/save-quiz', async (req, res) => {
  try {
    const { quizId, userId, summary, questions, score, total } = req.body;

    // Find quiz by UUID
    const quiz = await Quiz.findOne({ quizId });
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    const newResult = new QuizResult({
      quizId: quiz._id, // Store actual Mongo _id in results
      userId,
      summary: summary || '',
      questions: questions || [],
      score,
      total
    });

    await newResult.save();

    // Emit socket event for real-time updates
    req.io.to(quizId).emit('quiz-submitted', { userId, score, total });

    res.status(200).json({ message: 'Quiz result saved!' });
  } catch (err) {
    console.error('Error saving quiz result:', err);
    res.status(500).json({ error: 'Failed to save quiz result' });
  }
});

/**
 * Route: Get Quiz by UUID
 */
router.get('/get-quiz/:quizId', async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ quizId: req.params.quizId });
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });

    res.json({
      quizId: quiz.quizId,
      questions: quiz.questions,
      summary: quiz.summary
    });
  } catch (err) {
    console.error('Error fetching quiz:', err);
    res.status(500).json({ error: 'Failed to fetch quiz' });
  }
});

module.exports = router;

const mongoose = require('mongoose');

const quizResultSchema = new mongoose.Schema({
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: false, // loosened validation
  },
  userId: {
    type: String, // userName or userId as string
    required: false, // loosened validation
  },
  summary: String,
  questions: [
    {
      question: String,
      options: [String],
      answer: [String],          // <-- updated: array of strings
      selectedAnswer: [String],  // <-- updated: array of strings
    }
  ],
  score: Number,
  total: Number,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('QuizResult', quizResultSchema);

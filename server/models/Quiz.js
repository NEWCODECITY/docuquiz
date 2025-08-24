// const mongoose = require('mongoose');
// const { v4: uuidv4 } = require('uuid');

// const quizSchema = new mongoose.Schema({
//   quizId: {
//     type: String,
//     default: uuidv4,
//     unique: true
//   },
//   summary: String,
//   questions: [
//     {
//       question: String,
//       options: [String],
//       answer: String,
//     }
//   ],
//   createdAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// module.exports = mongoose.model('Quiz', quizSchema);
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const quizSchema = new mongoose.Schema({
  quizId: {
    type: String,
    default: uuidv4,
    unique: true
  },
  summary: String,
  questions: [
    {
      question: String,
      options: [String],
      answer: {
        type: [String], // allows multiple correct answers
        required: true,
        set: v => Array.isArray(v) ? v : [v] // ensures single answers are stored as array
      }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Quiz', quizSchema);

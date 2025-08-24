// const fetch = require('node-fetch');

// async function generateQuizWithMistral(summaryText) {
//   const prompt = `
// You are a helpful assistant that creates quizzes based on text summaries. 
// Generate a list of 3 multiple-choice questions from the summary below. 
// Each question should have 4 options and indicate the correct answer clearly in this JSON format:

// [
//   {
//     "question": "Question text here?",
//     "options": ["Option A", "Option B", "Option C", "Option D"],
//     "answer": "Correct option"
//   }
// ]

// Summary:
// ${summaryText}
// `;

//   const response = await fetch('http://127.0.0.1:11434/api/generate', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({
//       model: 'mistral',
//       prompt: prompt,
//       stream: false
//     }),
//   });

//   if (!response.ok) {
//     throw new Error(`Mistral API error: ${response.statusText}`);
//   }

//   const data = await response.json();

//   // Attempt to safely parse quiz as JSON array
//   try {
//     const quiz = JSON.parse(data.response);
//     return quiz;
//   } catch (err) {
//     throw new Error('Failed to parse quiz JSON. Mistral response:\n' + data.response);
//   }
// }

// module.exports = generateQuizWithMistral;

const { ollama } = require('../ollamaClient');

const generateQuizWithMistral = async (summary) => {
  const prompt = `
You are a quiz generator.

Based on the summary below, generate a quiz in the following exact JSON format:

[
  {
    "question": "What is the capital of France?",
    "options": ["Paris", "Rome", "Madrid", "Berlin"],
    "answer": "Paris"
  },
  ...
]

✅ Do NOT include any intro like "Here is your quiz".
✅ Do NOT use markdown or code blocks.
✅ Respond with only the JSON array.

Summary:
${summary}
`;

  const response = await ollama.chat({
    model: 'mistral',
    messages: [{ role: 'user', content: prompt }],
  });

  const raw = response.message.content.trim();

  // Extract the first JSON array
  const jsonMatch = raw.match(/\[\s*\{[\s\S]*?\}\s*\]/);

  if (!jsonMatch) {
    console.error('Mistral output (no valid JSON array):', raw);
    throw new Error('Quiz format error: no JSON array found in model response');
  }

  try {
    const quiz = JSON.parse(jsonMatch[0]);
    return quiz;
  } catch (err) {
    console.error('Failed to parse extracted JSON:', jsonMatch[0]);
    throw new Error('Quiz format error: extracted JSON is invalid');
  }
};

module.exports = generateQuizWithMistral;

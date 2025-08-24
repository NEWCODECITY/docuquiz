const generateQuizWithMistral = require('./server/utils/generateQuizWithMistral');

const testSummary = `
- Artificial Intelligence (AI) refers to the simulation of human intelligence in machines.
- AI applications include natural language processing, machine learning, and robotics.
- Ethical concerns in AI include privacy, bias, and job displacement.
- Ongoing research aims to create more general and adaptable AI systems.
`;

async function testQuiz() {
  try {
    const quiz = await generateQuizWithMistral(testSummary);
    console.log('Generated Quiz:', quiz);
  } catch (error) {
    console.error('Quiz generation failed:', error.message);
  }
}

testQuiz();

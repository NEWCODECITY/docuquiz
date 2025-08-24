const fetch = require('node-fetch');

async function summarizeWithMistral(pdfText) {
  const prompt = `
You are a PDF summarizer. Given a long piece of academic or technical text, generate a concise summary.
Use bullet points for clarity if the content has multiple sections.

Text:
${pdfText}

Summary:
`;

  const response = await fetch('http://127.0.0.1:11434/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'mistral',
      prompt: prompt,
      stream: false
    }),
  });

  if (!response.ok) {
    throw new Error(`Mistral API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.response;
}

module.exports = summarizeWithMistral;

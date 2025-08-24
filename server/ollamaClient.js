const { Ollama } = require('ollama');

const ollama = new Ollama(); // no config needed for local

module.exports = { ollama };

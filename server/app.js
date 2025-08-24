// const express = require('express');
// const cors = require('cors');
// const pdfRoutes = require('./routes/pdfRoutes');

// const app = express();

// app.use(cors());
// app.use(express.json());

// app.use('/api', pdfRoutes); // ✅ Correct route prefix

// module.exports = app;
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const pdfRoutes = require('./routes/pdfRoutes');

const app = express();

// ✅ Use CORS correctly
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());
app.use('/api', pdfRoutes);

module.exports = app;


// const express = require('express');
// const http = require('http'); // for creating HTTP server manually
// const cors = require('cors');
// const mongoose = require('mongoose');
// const { Server } = require('socket.io');
// const pdfRoutes = require('./routes/pdfRoutes');

// const app = express();
// const server = http.createServer(app); // 👈 wrap Express app with HTTP server
// const PORT = 5050;

// const MONGODB_URI = 'mongodb+srv://new_user:gLIsezyjAE3zr7gQ@cluster99.0xefp4l.mongodb.net/?retryWrites=true&w=majority&appName=Cluster99';

// // Connect to MongoDB Atlas
// mongoose.connect(MONGODB_URI)
//   .then(() => console.log('✅ Connected to MongoDB Atlas'))
//   .catch((err) => console.error('❌ MongoDB connection error:', err));

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Routes
// app.use('/api', pdfRoutes);

// // Socket.IO Setup
// const io = new Server(server, {
//   cors: {
//     origin: '*',
//     methods: ['GET', 'POST']
//   }
// });

// io.on('connection', (socket) => {
//   console.log('🔌 User connected:', socket.id);

//   // Join room
//   socket.on('join-room', (quizId) => {
//     socket.join(quizId);
//     console.log(`📥 ${socket.id} joined room ${quizId}`);
//     socket.to(quizId).emit('user-joined', socket.id);
//   });

//   // Receive and broadcast submitted answer
//   socket.on('submit-answer', ({ quizId, userId, answer }) => {
//     io.to(quizId).emit('new-answer', { userId, answer });
//   });

//   // Handle disconnect
//   socket.on('disconnect', () => {
//     console.log('❌ User disconnected:', socket.id);
//   });
// });

// // Start server
// server.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');

const pdfRoutes = require('./routes/pdfRoutes');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

// Attach io instance to req
app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use('/api', pdfRoutes);

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('join-room', (quizId) => {
    socket.join(quizId);
    console.log(`User joined quiz room: ${quizId}`);
    io.to(quizId).emit('user-joined', socket.id);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// MongoDB connection
const MONGO_URI = 'mongodb+srv://new_user:gLIsezyjAE3zr7gQ@cluster99.0xefp4l.mongodb.net/?retryWrites=true&w=majority&appName=Cluster99';

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

server.listen(5050, () => {
  console.log('Server running on port 5050');
});

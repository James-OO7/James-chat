const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: 'https://message-app-ochre.vercel.app', 
    methods: ['GET', 'POST'],
    credentials: true 
  }
});

app.use(cors({
  origin: 'https://message-app-ochre.vercel.app', 
  methods: ['GET', 'POST'],
  credentials: true
}));

const PORT = process.env.PORT || 3001;

const chatHistory = [];

io.on('connection', (socket) => {
    console.log('A user connected');
    socket.emit('chatHistory', chatHistory);
  
    socket.on('chatMessage', (data) => {
      const messageData = { user: data.user, text: data.text, timestamp: new Date().toISOString() };
      chatHistory.push(messageData);
  
      io.emit('chatMessage', messageData);
    });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

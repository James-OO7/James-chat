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

io.on('connection', (socket) => {
  console.log('A user connected');

  // Listen for 'chatMessage' and broadcast the user + message
  socket.on('chatMessage', (data) => {
    console.log(`${data.user}: ${data.text}`); // Log with username for debugging
    io.emit('chatMessage', { user: data.user, text: data.text }); // Broadcast message with username
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// server/index.js (or wherever your main server file is)

const express = require('express');
const app = express();
const path = require('path');
const http = require('http');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const connectDB = require('./config/db');
const AuthRouter = require('./routes/authRouter');
const ProfileRouter = require('./routes/profileRouter');
const ConnectionRequestRouter = require('./routes/requestRouter');
const UserRouter = require('./routes/userRouter');
const MessageRouter = require('./routes/messageRouter');
const Message = require('./models/messageModel');

app.use(express.json());
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);
app.use(cookieParser());
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.use('/', AuthRouter);
app.use('/', ProfileRouter);
app.use('/', ConnectionRequestRouter);
app.use('/', UserRouter);
app.use('/', MessageRouter);

const server = http.createServer(app);
const { Server } = require('socket.io');

// ---------------- Socket.io with online user tracking ----------------
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    credentials: true,
  },
});

// userId -> Set<socketId>
const onlineUsers = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join user to their own room (by userId)
  socket.on('join', (userId) => {
    if (!userId) return;
    socket.userId = String(userId);
    socket.join(socket.userId);

    if (!onlineUsers.has(socket.userId)) {
      onlineUsers.set(socket.userId, new Set());
    }
    onlineUsers.get(socket.userId).add(socket.id);

    // Broadcast presence
    io.emit('user_online', socket.userId);
    io.emit('online_users', Array.from(onlineUsers.keys()));
  });

  // Handle sending a message
  socket.on('send_message', async (data) => {
    try {
      const { sender, receiver, content } = data || {};
      if (!sender || !receiver || !content) return;

      const message = new Message({ sender, receiver, content });
      await message.save();

      // Emit to receiver's room (receiver userId room)
      io.to(String(receiver)).emit('receive_message', message);

      // Optionally emit to sender for confirmation
      socket.emit('message_sent', message);
    } catch (err) {
      console.error('send_message error:', err);
    }
  });

  socket.on('disconnect', () => {
    const userId = socket.userId;
    if (userId && onlineUsers.has(userId)) {
      const set = onlineUsers.get(userId);
      set.delete(socket.id);
      if (set.size === 0) {
        onlineUsers.delete(userId);
        io.emit('user_offline', userId);
      }
    }
    console.log('User disconnected:', socket.id);
  });
});

// ---------------- DB + Server start ----------------
connectDB()
  .then(() => {
    console.log('connected successfully');
    server.listen(3001, () => {
      console.log('server is running on port 3001');
    });
  })
  .catch((err) => {
    console.log(err);
  });

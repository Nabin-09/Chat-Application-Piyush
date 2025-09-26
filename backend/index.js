import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { Server } from "socket.io";
import { createServer } from "http";
import userRouter from './routes/user.routes.js';
import messageRouter from './routes/message.routes.js';
import userlistRouter from './routes/userlist.routes.js';
import messageModel from './models/message.model.js';
import './config/createUserTable.js';
import './config/createMessageTable.js';
import './config/createUserListTable.js';
import './config/createGroupTable.js';
import mysql_db from './config/db.js';
import groupRouter from './routes/group.routes.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? process.env.FRONTEND_URL || "*"
      : "http://localhost:5173",
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true
  }
});

const onlineUsers = new Map();

io.on('connection', (socket) => {
  console.log('User Connected:', socket.id);

  socket.on('register', (data) => {
    const { user_id } = data;
    if (user_id) {
      const userIdStr = user_id.toString();
      onlineUsers.set(userIdStr, socket.id);
      socket.join(userIdStr);
      console.log(`User ${userIdStr} registered with socket ${socket.id}`);
      console.log('Online users:', [...onlineUsers.entries()]);
    }
  });

  socket.on('message', async (data) => {
    const { sender_id, receiver_id, text } = data;
    console.log('Message received:', { sender_id, receiver_id, text });

    try {
      const db = await mysql_db();

      const [senderCheck] = await db.execute('SELECT id FROM users WHERE id = ?', [parseInt(sender_id)]);
      const [receiverCheck] = await db.execute('SELECT id FROM users WHERE id = ?', [parseInt(receiver_id)]);

      if (senderCheck.length === 0) {
        console.error(`Sender with ID ${sender_id} does not exist`);
        socket.emit('error', { message: `Sender with ID ${sender_id} does not exist` });
        await db.end();
        return;
      }

      if (receiverCheck.length === 0) {
        console.error(`Receiver with ID ${receiver_id} does not exist`);
        socket.emit('error', { message: `Receiver with ID ${receiver_id} does not exist` });
        await db.end();
        return;
      }

      await db.end();

      const messageId = await messageModel.createMessage({
        sender_id: parseInt(sender_id),
        receiver_id: parseInt(receiver_id),
        text,
        image: null
      });

      const db2 = await mysql_db();
      const [messages] = await db2.execute('SELECT * FROM messages WHERE id = ?', [messageId]);
      await db2.end();

      const savedMessage = messages[0];
      const messageToSend = {
        ...savedMessage,
        time: new Date(savedMessage.created_at).toLocaleTimeString()
      };

      // Emit to sender
      const senderSocketId = onlineUsers.get(sender_id.toString());
      if (senderSocketId) {
        io.to(sender_id.toString()).emit('receive-message', messageToSend);
        console.log(`Emitted to sender ${sender_id}`);
      }

      // Emit to receiver
      const receiverSocketId = onlineUsers.get(receiver_id.toString());
      if (receiverSocketId) {
        io.to(receiver_id.toString()).emit('receive-message', messageToSend);
        console.log(`Emitted to receiver ${receiver_id}`);
      }
    } catch (err) {
      console.error('Error saving message:', err);
      socket.emit('error', { message: 'Failed to send message' });
    }
  });

  socket.on('delete-message', async (data) => {
    const { messageId, sender_id } = data;
    try {
      const db = await mysql_db();
      const [rows] = await db.execute('SELECT * FROM messages WHERE id = ? AND sender_id = ?', [messageId, sender_id]);
      if (rows.length > 0) {
        await messageModel.deleteMessage(messageId);
        io.emit('message-deleted', { messageId: parseInt(messageId) });
        console.log(`Message ${messageId} deleted by user ${sender_id}`);
      }
      await db.end();
    } catch (err) {
      console.error('Error deleting message:', err);
    }
  });

  socket.on('add-reaction', async (data) => {
    const { messageId, reaction } = data;
    try {
      const db = await mysql_db();
      const [rows] = await db.execute('SELECT reactions FROM messages WHERE id = ?', [messageId]);
      if (rows.length > 0) {
        const message = rows[0];
        let reactions = [];

        if (typeof message.reactions === 'string') {
          reactions = JSON.parse(message.reactions);
        } else if (Array.isArray(message.reactions)) {
          reactions = message.reactions;
        }

        reactions.push(reaction);
        await messageModel.updateMessageReactions(messageId, JSON.stringify(reactions));
        io.emit('reaction-added', { messageId, reactions });
        console.log(`Reaction ${reaction.emoji} added to message ${messageId}`);
      }
      await db.end();
    } catch (err) {
      console.error('Error adding reaction:', err);
    }
  });

  socket.on('forward-message', async (data) => {
    const { sender_id, receiver_id, message } = data;
    try {
      const db = await mysql_db();
      const newMessage = {
        sender_id: parseInt(sender_id),
        receiver_id: parseInt(receiver_id),
        text: message.text || '',
        image: message.image || null 
      };

      const messageId = await messageModel.createMessage(newMessage);
      const forwardedMessage = { ...message, id: messageId, sender_id, receiver_id, created_at: newMessage.created_at, reactions: [] };
      io.to(receiver_id.toString()).emit('message-forwarded', { receiverId: receiver_id, message: forwardedMessage });
      console.log(`Message ${message.id} forwarded from ${sender_id} to ${receiver_id}`);
      await db.end();
    } catch (err) {
      console.error('Error forwarding message:', err);
    }
  });

  socket.on('send-group-message', async (data) => {
  const { group_id, sender_id, text } = data;
  try {
    const db = await mysql_db();
    const [result] = await db.execute(
      'INSERT INTO group_messages (group_id, sender_id, text) VALUES (?, ?, ?)',
      [group_id, sender_id, text]
    );
    const messageId = result.insertId;

    const [messageRows] = await db.execute(
      `SELECT gm.id, gm.group_id, gm.sender_id, u.username, gm.text, gm.created_at
       FROM group_messages gm
       JOIN users u ON gm.sender_id = u.id
       WHERE gm.id = ?`,
      [messageId]
    );
    await db.end();

    const savedMessage = messageRows[0];

    // Get all members of the group
    const db2 = await mysql_db();
    const [members] = await db2.execute(
      `SELECT user_id FROM group_members WHERE group_id = ?`,
      [group_id]
    );
    await db2.end();

    members.forEach(({ user_id }) => {
      const socketId = onlineUsers.get(user_id.toString());
      if (socketId) {
        io.to(socketId).emit('receive-group-message', savedMessage);
      }
    });

    console.log(`Group message sent to group ${group_id}`);
  } catch (err) {
    console.error('Error sending group message via socket:', err);
    socket.emit('error', { message: 'Failed to send group message' });
  }
});


  socket.on('unregister', (data) => {
    const { user_id } = data;
    if (user_id) {
      onlineUsers.delete(user_id.toString());
      console.log(`User ${user_id} unregistered`);
      console.log('Updated online users:', [...onlineUsers.entries()]);
    }
  });

  socket.on('disconnect', () => {
    console.log('Disconnected:', socket.id);
    for (let [user_id, socket_id] of onlineUsers.entries()) {
      if (socket_id === socket.id) {
        onlineUsers.delete(user_id);
        console.log(`User ${user_id} removed from onlineUsers`);
        break;
      }
    }
    console.log('Updated online users:', [...onlineUsers.entries()]);
  });
});

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL || "*"
    : 'http://localhost:5173',
  methods: ['GET', 'POST', 'DELETE', 'PUT'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/user', userRouter);
app.use('/message', messageRouter);
app.use('/userlist', userlistRouter);
app.use('/group', groupRouter);
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));



app.get('/', (req, res) => {
  res.send("🚀 Backend is working!");
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

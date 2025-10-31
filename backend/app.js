require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
require('./config/db');
const aiRoutes = require('./routes/ai');
const workspaceRoutes = require('./routes/workspace');
const authRoutes = require('./routes/auth');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ status: 'AICo backend running', health: '/api/health' });
});

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

app.use('/api/ai', aiRoutes);
app.use('/api/workspaces', workspaceRoutes);
app.use('/api/auth', authRoutes);

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*'} });

io.on('connection', (socket) => {
  socket.on('join_workspace', (workspaceId) => {
    socket.join(workspaceId);
  });
  socket.on('chat_message', (data) => {
    if (data && data.workspaceId) {
      socket.to(data.workspaceId).emit('chat_message', data);
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

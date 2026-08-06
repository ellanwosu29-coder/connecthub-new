// ERROR HANDLING
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection:', reason);
});

const dns = require('node:dns');
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
require('dotenv').config();

console.log('MONGO_URI from env:', process.env.MONGO_URI ? "✅ Loaded" : "❌ Still Undefined");

const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const connectDB = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const socketIO = require('./socket/socket');

const app = express();
const server = http.createServer(app);

// CORS
app.use(cors());
app.use(express.json());

// Socket.IO
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Database
connectDB();

// TEST ROUTE - This MUST work
app.get('/api/test', (req, res) => {
    res.json({ 
        message: 'Backend is working!',
        timestamp: new Date().toISOString()
    });
});

// Routes
console.log('📦 Registering routes...');
app.use('/api/auth', authRoutes);
app.use('/api/friends', require('./routes/friendRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));
app.use('/api/groups', require('./routes/groupRoutes'));
app.use('/api/status', require('./routes/statusRoutes'));
console.log('✅ Routes registered');

// 404 handler - ADD THIS
app.use((req, res) => {
    console.log(`❌ 404: ${req.method} ${req.url}`);
    res.status(404).json({ 
        error: 'Route not found',
        path: req.url,
        method: req.method
    });
});

// Socket.IO
socketIO(io);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`✅ Test route: http://localhost:${PORT}/api/test`);
});
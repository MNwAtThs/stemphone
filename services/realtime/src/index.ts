import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { MQTTBridge } from './mqtt-bridge';
import { RoomManager } from './room-manager';
import { PresenceManager } from './presence-manager';
import { PTTManager } from './ptt-manager';

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.CORS_ORIGIN || "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(cors());
app.use(express.json());

// Initialize managers
const mqttBridge = new MQTTBridge();
const roomManager = new RoomManager();
const presenceManager = new PresenceManager();
const pttManager = new PTTManager();

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        connections: io.engine.clientsCount
    });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);

    // Handle user authentication/identification
    socket.on('identify', async (userData) => {
        socket.data.user = userData;
        await presenceManager.setUserOnline(socket.id, userData);

        // Notify others about user presence
        socket.broadcast.emit('user-online', {
            userId: userData.id,
            username: userData.username,
            status: 'online'
        });
    });

    // Room management
    socket.on('join-room', async (roomId) => {
        try {
            await roomManager.joinRoom(socket.id, roomId);
            socket.join(roomId);

            // Get room info and broadcast to room
            const roomInfo = await roomManager.getRoomInfo(roomId);
            io.to(roomId).emit('room-updated', roomInfo);

            console.log(`User ${socket.id} joined room ${roomId}`);
        } catch (error) {
            socket.emit('error', { message: 'Failed to join room', error });
        }
    });

    socket.on('leave-room', async (roomId) => {
        try {
            await roomManager.leaveRoom(socket.id, roomId);
            socket.leave(roomId);

            const roomInfo = await roomManager.getRoomInfo(roomId);
            io.to(roomId).emit('room-updated', roomInfo);

            console.log(`User ${socket.id} left room ${roomId}`);
        } catch (error) {
            socket.emit('error', { message: 'Failed to leave room', error });
        }
    });

    // PTT (Push-to-Talk) management
    socket.on('ptt-request', async (data) => {
        const { roomId } = data;
        try {
            const granted = await pttManager.requestPTT(socket.id, roomId);

            if (granted) {
                socket.emit('ptt-granted', { roomId });
                socket.to(roomId).emit('ptt-active', {
                    userId: socket.data.user?.id,
                    username: socket.data.user?.username
                });
            } else {
                socket.emit('ptt-denied', { roomId, reason: 'PTT already active' });
            }
        } catch (error) {
            socket.emit('error', { message: 'PTT request failed', error });
        }
    });

    socket.on('ptt-release', async (data) => {
        const { roomId } = data;
        try {
            await pttManager.releasePTT(socket.id, roomId);
            io.to(roomId).emit('ptt-released', { roomId });
        } catch (error) {
            socket.emit('error', { message: 'PTT release failed', error });
        }
    });

    // Audio streaming for PTT
    socket.on('audio-data', (data) => {
        const { roomId, audioData } = data;
        // Only forward audio if user has PTT
        if (pttManager.hasPTT(socket.id, roomId)) {
            socket.to(roomId).emit('audio-stream', {
                userId: socket.data.user?.id,
                audioData
            });
        }
    });

    // Chat messages
    socket.on('chat-message', async (data) => {
        const { roomId, message } = data;
        const chatMessage = {
            id: Date.now().toString(),
            userId: socket.data.user?.id,
            username: socket.data.user?.username,
            message,
            timestamp: new Date().toISOString()
        };

        // Store message (in production, save to database)
        io.to(roomId).emit('chat-message', chatMessage);

        // Forward to MQTT if configured
        mqttBridge.publish(`stemphone/rooms/${roomId}/chat`, chatMessage);
    });

    // WebRTC signaling
    socket.on('webrtc-offer', (data) => {
        socket.to(data.targetId).emit('webrtc-offer', {
            offer: data.offer,
            from: socket.id
        });
    });

    socket.on('webrtc-answer', (data) => {
        socket.to(data.targetId).emit('webrtc-answer', {
            answer: data.answer,
            from: socket.id
        });
    });

    socket.on('webrtc-ice-candidate', (data) => {
        socket.to(data.targetId).emit('webrtc-ice-candidate', {
            candidate: data.candidate,
            from: socket.id
        });
    });

    // Handle disconnection
    socket.on('disconnect', async () => {
        console.log(`Client disconnected: ${socket.id}`);

        // Clean up user presence
        const userData = socket.data.user;
        if (userData) {
            await presenceManager.setUserOffline(socket.id);
            socket.broadcast.emit('user-offline', {
                userId: userData.id,
                username: userData.username,
                status: 'offline'
            });
        }

        // Release any active PTT
        await pttManager.releaseAllPTT(socket.id);

        // Leave all rooms
        await roomManager.leaveAllRooms(socket.id);
    });
});

// Initialize MQTT bridge
mqttBridge.initialize().then(() => {
    console.log('MQTT bridge initialized');
}).catch((error) => {
    console.error('Failed to initialize MQTT bridge:', error);
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Stemphone Realtime Service running on port ${PORT}`);
});


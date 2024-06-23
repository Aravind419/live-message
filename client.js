const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const upload = multer({ dest: 'uploads/' });

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('joinRoom', ({ roomId, username }) => {
        socket.join(roomId);
        io.to(roomId).emit('status', `${username} has joined the room`);
        socket.on('disconnect', () => {
            io.to(roomId).emit('status', `${username} has left the room`);
        });
    });

    socket.on('sendMessage', ({ roomId, message }) => {
        io.to(roomId).emit('message', message);
    });

    socket.on('screenshot', (roomId) => {
        io.to(roomId).emit('screenshot', 'A screenshot has been taken');
    });

    socket.on('videoCall', (roomId) => {
        io.to(roomId).emit('videoCall', 'Starting video call...');
    });

    socket.on('audioCall', (roomId) => {
        io.to(roomId).emit('audioCall', 'Starting audio call...');
    });
});

app.post('/upload', upload.array('files'), (req, res) => {
    res.json({ files: req.files });
});

app.get('/generateRoomId', (req, res) => {
    const roomId = uuidv4();
    res.json({ roomId });
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});

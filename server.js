const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const multer = require('multer');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Handle file upload requests
app.post('/upload', upload.single('file'), (req, res) => {
    res.json({ filePath: `/uploads/${req.file.filename}` });
});

// Socket.io connection handling
io.on('connection', (socket) => {
    console.log('A user connected');

    // Handle joining a room
    socket.on('join-room', (room) => {
        socket.join(room);
        console.log(`User joined room: ${room}`);
        // Notify all users in the room about the new user
        io.to(room).emit('message', { room, message: 'A user has joined the room' });
    });

    // Handle message sending
    socket.on('message', (data) => {
        io.to(data.room).emit('message', data);
    });

    // Handle typing indication
    socket.on('typing', (data) => {
        socket.to(data.room).emit('typing', data);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('A user disconnected');
        // Notify all users about the disconnection
        io.emit('message', { message: 'A user has disconnected' });
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

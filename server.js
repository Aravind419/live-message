const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('join-room', (room) => {
        socket.join(room);
        console.log(`User joined room: ${room}`);
    });

    socket.on('message', (data) => {
        io.to(data.room).emit('message', data);
    });

    socket.on('typing', (data) => {
        socket.to(data.room).emit('typing', data);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});

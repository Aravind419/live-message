const socket = io();

const roomInput = document.getElementById('room-name');
const joinRoomButton = document.getElementById('join-room');
const messageInput = document.getElementById('message-input');
const chatBox = document.getElementById('chat-box');
const sendButton = document.getElementById('send-button');

let currentRoom = '';

joinRoomButton.addEventListener('click', () => {
    currentRoom = roomInput.value;
    if (currentRoom) {
        socket.emit('join-room', currentRoom);
    }
});

messageInput.addEventListener('input', () => {
    if (currentRoom) {
        socket.emit('typing', { room: currentRoom, message: 'User is typing...' });
    }
});

sendButton.addEventListener('click', () => {
    const message = messageInput.value;
    if (message && currentRoom) {
        socket.emit('message', { room: currentRoom, message: message });
        messageInput.value = '';
        socket.emit('typing', { room: currentRoom, message: '' });
    }
});

socket.on('message', (data) => {
    if (data.room === currentRoom) {
        const messageElement = document.createElement('div');
        messageElement.textContent = data.message;
        chatBox.appendChild(messageElement);
        chatBox.scrollTop = chatBox.scrollHeight;
    }
});

socket.on('typing', (data) => {
    if (data.room === currentRoom) {
        const typingIndicator = document.getElementById('typing-indicator');
        if (data.message) {
            if (!typingIndicator) {
                const typingElement = document.createElement('div');
                typingElement.id = 'typing-indicator';
                typingElement.textContent = data.message;
                chatBox.appendChild(typingElement);
            }
        } else {
            if (typingIndicator) {
                typingIndicator.remove();
            }
        }
    }
});

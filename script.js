const socket = io();

const roomInput = document.getElementById('room-name');
const joinRoomButton = document.getElementById('join-room');
const messageInput = document.getElementById('message-input');
const chatBox = document.getElementById('chat-box');
const sendButton = document.getElementById('send-button');
const status = document.getElementById('status');
const fileUpload = document.getElementById('file-upload');
const videoCallButton = document.getElementById('video-call');
const audioCallButton = document.getElementById('audio-call');
const screenshotButton = document.getElementById('screenshot-button');
const deleteHistoryButton = document.getElementById('delete-history');

let currentRoom = '';

joinRoomButton.addEventListener('click', () => {
    currentRoom = roomInput.value || 'Aravind006';
    if (currentRoom) {
        socket.emit('join-room', currentRoom);
        status.textContent = 'Connected';
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
    } else {
        alert('Text is empty!');
    }
});

socket.on('message', (data) => {
    if (data.room === currentRoom) {
        const messageElement = document.createElement('div');
        messageElement.textContent = data.message;
        chatBox.appendChild(messageElement);
        chatBox.scrollTop = chatBox.scrollHeight;
        if (data.file) {
            const fileElement = document.createElement('a');
            fileElement.href = data.file;
            fileElement.textContent = 'File';
            chatBox.appendChild(fileElement);
        }
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

fileUpload.addEventListener('change', () => {
    const file = fileUpload.files[0];
    const formData = new FormData();
    formData.append('file', file);
    fetch('/upload', {
        method: 'POST',
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        if (data.filePath) {
            socket.emit('message', { room: currentRoom, message: 'File uploaded', file: data.filePath });
        }
    });
});

videoCallButton.addEventListener('click', () => {
    // Implement video call functionality
});

audioCallButton.addEventListener('click', () => {
    // Implement audio call functionality
});

screenshotButton.addEventListener('click', () => {
    // Implement screenshot functionality
    alert('Your friend captured a screenshot!');
});

deleteHistoryButton.addEventListener('click', () => {
    chatBox.innerHTML = '';
    // Implement auto delete history functionality
});

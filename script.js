const socket = io();

const messageInput = document.getElementById('message-input');
const chatBox = document.getElementById('chat-box');
const sendButton = document.getElementById('send-button');

messageInput.addEventListener('keyup', () => {
    socket.emit('typing', messageInput.value);
});

sendButton.addEventListener('click', () => {
    const message = messageInput.value;
    socket.emit('message', message);
    messageInput.value = '';
});

socket.on('message', (message) => {
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
});

socket.on('typing', (message) => {
    // Optionally display "User is typing..." message
});

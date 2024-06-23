const socket = io();
let currentRoomId = '';
let currentUsername = '';

const secretKey = "Aravind006";

function connectWithSecretKey() {
    const enteredKey = document.getElementById('secret-key').value;
    if (enteredKey === secretKey) {
        currentRoomId = 'secretRoom';
        currentUsername = 'SecretUser';
        joinRoom();
    } else {
        alert('Incorrect Secret Key');
    }
}

function generateRoomId() {
    fetch('/generateRoomId')
        .then(response => response.json())
        .then(data => {
            document.getElementById('room-id').value = data.roomId;
        });
}

function joinRoom() {
    const roomId = document.getElementById('room-id').value;
    const username = document.getElementById('username').value;
    if (!roomId || !username) {
        alert('Room ID and Username are required.');
        return;
    }

    currentRoomId = roomId;
    currentUsername = username;

    socket.emit('joinRoom', { roomId, username });
    document.getElementById('status').innerText = `Connected to ${roomId}`;

    document.getElementById('room-id').value = '';
    document.getElementById('username').value = '';

    socket.on('status', (status) => {
        displayMessage(status);
    });

    socket.on('message', (message) => {
        displayMessage(message);
    });

    socket.on('screenshot', (message) => {
        alert(message);
    });

    socket.on('videoCall', (message) => {
        alert(message);
    });

    socket.on('audioCall', (message) => {
        alert(message);
    });
}

function sendMessage() {
    const message = document.getElementById('message').value;
    if (message.trim() === "") {
        document.getElementById('warning').innerText = "Warning: Text is empty!";
    } else {
        socket.emit('sendMessage', { roomId: currentRoomId, message });
        document.getElementById('message').value = "";
        document.getElementById('warning').innerText = "";
    }
}

function displayMessage(message) {
    const chat = document.getElementById('chat');
    chat.value += message + '\n';
}

function startVideoCall() {
    socket.emit('videoCall', currentRoomId);
}

function startAudioCall() {
    socket.emit('audioCall', currentRoomId);
}

function searchContent() {
    const query = document.getElementById('search-query').value;
    if (query.trim() !== "") {
        fetch(`https://www.googleapis.com/customsearch/v1?key=YOUR_API_KEY&cx=YOUR_CX&q=${query}`)
            .then(response => response.json())
            .then(data => {
                let results = '<h3>Search Results:</h3>';
                data.items.forEach(item => {
                    results += `<p><a href="${item.link}">${item.title}</a><br>${item.snippet}</p>`;
                });
                document.getElementById('search-results').innerHTML = results;
            });
    }
}

document.getElementById('file-upload').addEventListener('change', function() {
    const files = document.getElementById('file-upload').files;
    const formData = new FormData();
    for (const file of files) {
        formData.append('files', file);
    }
    fetch('/upload', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        alert("Files/Photos uploaded successfully!");
    });
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'PrintScreen') {
        socket.emit('screenshot', currentRoomId);
    }
});

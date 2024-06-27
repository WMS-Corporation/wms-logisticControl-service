const socketClient = require('socket.io-client');
let socket;

function connectSocket(gatewayUrl) {
    socket = socketClient(gatewayUrl);
    socket.on('connect', () => {
        console.log(`Connected to gateway at ${gatewayUrl}`);
    });
}

function getSocket() {
    if (!socket) {
        throw new Error("Socket not initialized. Call connectSocket first.");
    }
    return socket;
}

module.exports = { connectSocket, getSocket };
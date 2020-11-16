const socketio = (server) => {
  const io = require('socket.io')(server, {
    cors: process.env.CORS_ORIGIN || "http://localhost:3000",
    methods: ["GET", "POST"],
  });

  io.on('connection', (socket) => {
    console.log(`${socket.id} connected.`);
    socket.on('join', (gameId) => {
      console.log(`Adding ${socket.id} to ${gameId}`);
      socket.join(gameId);
    });

    socket.on('chat', (gameId, user, message) => {
        console.log(`Received message: (${user})  ${message}`);
        socket.to(gameId).broadcast.emit('chat', user, message);
    });
  })
  return io;
}

module.exports = socketio;

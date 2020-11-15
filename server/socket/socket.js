const socketio = (server) => {
  const io = require('socket.io')(server);
  io.on('connection', function(socket) {
    console.log(`${socket.id} connected.`);
    socket.on('join', (gameId) => {
      socket.join(gameId);
    });

    socket.on('chat', (gameId, user, message) => {
        io.to(gameId).emit('chat', user, message);
    });
  })
  return io;
}

module.exports = socketio;

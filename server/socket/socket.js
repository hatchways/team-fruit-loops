const handlers = require("./handlers");

const events = {
  "disconnecting": handlers.disconnecting,
  "disconnect": handlers.disconnect,
  "leave": handlers.leave,
  "chat": handlers.chat,
  "assign": handlers.assign,
  "unassign": handlers.unassign,
  "start": handlers.start,
  "guesserNextMove": handlers.guesserNextMove,
  "spyNextMove": handlers.spyNextMove,
  "endTurn": handlers.endTurn,
  "restartGame": handlers.restartGame,
  "refreshPublic": handlers.refresh
};

const socketio = server => {
  const io = require('socket.io')(server, {
    cors: process.env.CORS_ORIGIN || 'http://localhost:3000',
    methods: ['GET', 'POST']
  })

  io.on('connection', socket => {
    console.log(`${socket.id} connected.`);

    for (let [event, handler] of Object.entries(events)) {
      socket.on(event, handler(io, socket));
    }
  })
  return io
}

module.exports = socketio

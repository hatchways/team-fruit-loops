const generalHandlers = require('./generalHandlers');
const gameHandlers = require('./gameHandlers');
const chatHandlers = require('./chatHandlers');

const events = {
  "disconnecting": generalHandlers.disconnecting,
  "disconnect": generalHandlers.disconnect,
  "leave": generalHandlers.leave,
  "refreshPublic": generalHandlers.refresh,
  "chat": chatHandlers.chat,
  "assign": gameHandlers.assign,
  "unassign": gameHandlers.unassign,
  "start": gameHandlers.start,
  "guesserNextMove": gameHandlers.guesserNextMove,
  "spyNextMove": gameHandlers.spyNextMove,
  "endTurn": gameHandlers.endTurn,
  "restartGame": gameHandlers.restartGame,
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
  return io;
}

module.exports = socketio;

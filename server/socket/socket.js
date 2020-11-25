const handlers = require("./handlers");

const events = {
  "chat": handlers.chat,
};

const socketio = server => {
  const io = require('socket.io')(server, {
    cors: process.env.CORS_ORIGIN || "http://localhost:3000",
    methods: ["GET", "POST"],
  });

  io.on('connection', socket => {
    console.log(`${socket.id} connected.`);

    socket.on("join", gameId => {
      console.log(`Adding ${socket.id} to ${gameId}`);
      socket.join(gameId);
    });

    for (let [event, handler] of Object.entries(events)) {
      socket.on(event, handler(io));
    }
  })
  return io;
}

module.exports = socketio;

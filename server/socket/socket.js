const handlers = require("./handlers");

const events = {
  "chat": handlers.chat,
  "guesserNextMove": handlers.guesserNextMove,
  "spyNextMove": handlers.spyNextMove,
};


// Spymaster's turn: Submit hint and number of guesses
socket.on('spyNextMove', (gameID, player, hint, guesses) => {
  if (gameController.globalState[gameID]) {
    let gameState = {}
    let thrownError

    try {
      gameState = gameController.globalState[gameID].gameEngine.spyNextMove(
        player,
        hint,
        guesses
      )
    } catch (err) {
      thrownError = err.message
    }

    io.in(gameID).emit('spyNextMove', gameState, thrownError)
  }
})

socket.on('endTurn', gameID => {
  if (gameController.globalState[gameID]) {
    io.in(gameID).emit(
      'endTurn',
      gameController.globalState[gameID].gameEngine.endTurn()
    )
  }
})

socket.on('restartGame', gameID => {
  if (gameController.globalState[gameID]) {
    io.in(gameID).emit(
      'restartGame',
      gameController.globalState[gameID].gameEngine.restart()
    )
  }
})

const socketio = server => {
  const io = require('socket.io')(server, {
    cors: process.env.CORS_ORIGIN || 'http://localhost:3000',
    methods: ['GET', 'POST']
  })

  io.on('connection', socket => {
    console.log(`${socket.id} connected.`);

    socket.on("join", gameID => {
      console.log(`Adding ${socket.id} to ${gameID}`);
      socket.join(gameID);
    });

    for (let [event, handler] of Object.entries(events)) {
      socket.on(event, handler(io));
    }
  })
  return io
}

module.exports = socketio

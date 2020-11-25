const gameController = require('../controllers/game')

const socketio = server => {
  const io = require('socket.io')(server, {
    cors: process.env.CORS_ORIGIN || 'http://localhost:3000',
    methods: ['GET', 'POST']
  })

  io.on('connection', socket => {
    console.log(`${socket.id} connected.`)
    socket.on('join', gameId => {
      console.log(`Adding ${socket.id} to ${gameId}`)
      socket.join(gameId)
    })

    socket.on('chat', (gameId, user, message) => {
      console.log(`Received message: (${user})  ${message}`)
      socket.to(gameId).broadcast.emit('chat', user, message)
    })

    // Guesser's turn: Submit selected word
    socket.on('guesserNextMove', (gameID, player, word) => {
      console.log(gameController.globalState)

      if (gameController.globalState[gameID]) {
        let gameState = {}
        let thrownError

        try {
          gameState = gameController.globalState[
            gameID
          ].gameEngine.guesserNextMove(player, word)
        } catch (err) {
          console.log(err)
          thrownError = err.message
        }

        io.in(gameID).emit('guesserNextMove', gameState, thrownError)
      }
    })

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
  })
  return io
}

module.exports = socketio

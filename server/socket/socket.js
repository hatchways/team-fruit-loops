const gameController = require('../controllers/game')

const socketio = server => {
  const io = require('socket.io')(server, {
    cors: process.env.CORS_ORIGIN || 'http://localhost:3000',
    methods: ['GET', 'POST']
  })

  io.on('connection', socket => {
    console.log(`${socket.id} connected.`)

    socket.on('disconnecting', () => {
      const gameList = Array.from(socket.rooms).filter(item => item!=socket.id)
      console.log(`${socket.id} disconnecting`)
      // remove the player from room
      for (gameID of gameList) {
        const activePlayers = gameController.globalState[gameID].activePlayers
        // remove the player from the active player list
        delete activePlayers[socket.id]
        if (Object.keys(activePlayers).length === 0)
          // remove the game if there are no active players
          delete gameController.globalState[gameID]

      }
    })

    socket.on('disconnect', () => {
      console.log(`${socket.id} disconnected`)
    })

    socket.on('leave', (gameID) => {
      const activePlayers = gameController.globalState[gameID].activePlayers
      delete activePlayers[socket.id]
      if (Object.keys(activePlayers).length === 0)
        // remove the game if there are no active players
        delete gameController.globalState[gameID]
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

        io.to(gameID).emit('update', gameState, thrownError, word)
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

        io.to(gameID).emit('update', gameState, thrownError)
      }
    })

    socket.on('endTurn', gameID => {
      if (gameController.globalState[gameID]) {
        io.to(gameID).emit(
          'update',
          gameController.globalState[gameID].gameEngine.endTurn()
        )
      }
    })

    socket.on('restartGame', gameID => {
      if (gameController.globalState[gameID]) {
        io.to(gameID).emit(
          'update',
          gameController.globalState[gameID].gameEngine.restart()
        )
      }
    })
  })
  return io
}

module.exports = socketio

const gameController = require('../controllers/game')

// Propagate players chats & chat notifications to all in gameID
const chat = io => (gameID, type, text, author) => {
  if (process.env.NODE_ENV !== "production") {
    console.log(`Received ${type} in game ${gameID} from ${author}: ${text}`);
  }
  io.in(gameID).emit("chat", type, text, author);
};

// Guesser's turn: Submit selected word
const guesserNextMove = io => (gameID, player, word) => {
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
}

// Spymaster's turn: Submit hint and number of guesses
const spyNextMove = io => (gameID, player, hint, guesses) => {
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
}

const endTurn = io => gameID => {
  if (gameController.globalState[gameID]) {
    io.in(gameID).emit(
      'endTurn',
      gameController.globalState[gameID].gameEngine.endTurn()
    )
  }
}

const restartGame = io => gameID => {
  if (gameController.globalState[gameID]) {
    io.in(gameID).emit(
      'restartGame',
      gameController.globalState[gameID].gameEngine.restart()
    )
  }
}

module.exports = {
  chat,
  guesserNextMove,
  spyNextMove,
  endTurn,
  restartGame,
}

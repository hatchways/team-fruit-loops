const gameController = require('../controllers/game')

const disconnecting = (io, socket) => () => {
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
};

const disconnect = (io, socket) => () => {
  console.log(`${socket.id} disconnected`);
};

const leave = (io, socket) => gameID => {
  const activePlayers = gameController.globalState[gameID].activePlayers;
  delete activePlayers[socket.id];
  // remove the game if there are no active players
  if (Object.keys(activePlayers).length === 0)
    delete gameController.globalState[gameID];
};

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

    io.to(gameID).emit('update', gameState, thrownError)
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

    io.to(gameID).emit('update', gameState, thrownError)
  }
}

const endTurn = io => gameID => {
  if (gameController.globalState[gameID]) {
    io.to(gameID).emit(
      'update',
      gameController.globalState[gameID].gameEngine.endTurn()
    )
  }
}

const restartGame = io => gameID => {
  if (gameController.globalState[gameID]) {
    io.to(gameID).emit(
      'update',
      gameController.globalState[gameID].gameEngine.restart()
    )
  }
}

module.exports = {
  disconnecting,
  disconnect,
  leave,
  chat,
  guesserNextMove,
  spyNextMove,
  endTurn,
  restartGame,
}

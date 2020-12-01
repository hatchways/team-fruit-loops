const gameController = require('../controllers/game')

const disconnecting = (io, socket) => () => {
  const gameList = Array.from(socket.rooms).filter(item => item!=socket.id)
  console.log(`${socket.id} disconnecting`)
  // remove the player from room
  for (gameID of gameList) {
    if (gameController.globalState[gameID] === undefined) {
      console.log(`game (id: ${gameID}) does not exist.`);
      continue;
    }

    const activePlayers = gameController.globalState[gameID].activePlayers
    // remove the player from the active player list
    delete activePlayers[socket.id]
    if (Object.keys(activePlayers).length === 0)
      delete gameController.globalState[gameID]
  }
};

const disconnect = (io, socket) => () => {
  console.log(`${socket.id} disconnected`);
};

const leave = (io, socket) => gameID => {
  const room = gameController.globalState[gameID];
  if (room) {
    const activePlayers = room.activePlayers;
    delete activePlayers[socket.id];
    // remove the game if there are no active players
    if (Object.keys(activePlayers).length === 0)
      delete gameController.globalState[gameID];
  }
};

const execute = (io, room, method, params, selectedWord = undefined) => {
  const {id, gameEngine} = room;
  try {
    const gameState = method.apply(gameEngine, params);
    //console.log(gameState)
    io.to(id).emit('update', {gameState: gameState, word: selectedWord});
  }
  catch (e) {
    console.log(`Error: ${e.message}`);
    io.to(id).emit('update', {error: e.message});
  }
}

const assign = io => (gameID, player, role) => {
  const room = gameController.globalState[gameID];
  if (room) {
    const game = room.gameEngine;
    execute(io, room, game.assignRole, [player, role]);
  }
}

const unassign = io => (gameID, player, role) => {
  const room = gameController.globalState[gameID];
  if (room) {
    const game = room.gameEngine;
    execute(io, room, game.unassignRole, [player, role]);
  }
}

const start = io => gameID => {
  const room = gameController.globalState[gameID];
  if (room) {
    const game = room.gameEngine;
    const timer = setInterval(() => {
      if (game.gameState.isEnd)
        clearInterval(timer);

      game.timerCountDown();
      io.to(gameID).emit('timer', game.gameState.timer);
    }, 1000);
    execute(io, room, game.start, []);
  }
}

// Propagate players chats & chat notifications to all in gameID
const chat = io => (gameID, type, text, author) => {
  if (process.env.NODE_ENV !== "production") {
    console.log(`Received ${type} in game ${gameID} from ${author}: ${text}`);
  }
  io.to(gameID).emit("chat", type, text, author);
};

// Guesser's turn: Submit selected word
const guesserNextMove = io => (gameID, player, word) => {
  const room = gameController.globalState[gameID];
  if (room) {
    const game = room.gameEngine;
    execute(io, room, game.guesserNextMove, [player, word], word);
  }
}

// Spymaster's turn: Submit hint and number of guesses
const spyNextMove = io => (gameID, player, hint, guesses) => {
  const room = gameController.globalState[gameID];
  if (room) {
    const game = room.gameEngine;
    execute(io, room, game.spyNextMove, [player, hint, guesses]);
  }
}

const endTurn = io => gameID => {
  const room = gameController.globalState[gameID];
  if (room) {
    const game = room.gameEngine;
    execute(io, room, game.endTurn, []);
  }
}

const restartGame = io => gameID => {
  const room = gameController.globalState[gameID];
  if (room) {
    const game = room.gameEngine;
    execute(io, room, game.restart, []);
  }
}

module.exports = {
  disconnecting,
  disconnect,
  leave,
  assign,
  unassign,
  start,
  chat,
  guesserNextMove,
  spyNextMove,
  endTurn,
  restartGame,
}

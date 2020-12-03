const gameController = require('../controllers/game');

const execute = (io, room, {method, params, word, callback}) => {
  const {id, gameEngine} = room;
  try {
    const gameState = method.apply(gameEngine, params);
    if (callback !== undefined) {
      callback();
    }

    // emit message to all if the game has not started yet.
    // emit limited game state to guesser once the game starts.
    if (gameState.boardState === undefined) {
      io.to(id).emit('update', {gameState: gameState, word: word});
    }
    else {
      const {cards, ...guesserState} = gameState;
      io.to(`${id}-spy`).emit('update', {gameState: gameState, word: word});
      io.to(`${id}-guesser`).emit('update', {gameState: guesserState, word: word});
    }
  }
  catch (e) {
    console.log(`Error: ${e.message}`);
    io.to(id).emit('update', {error: e.message});
  }
}

const assign = (io, socket) => (gameID, player, role) => {
  const room = gameController.globalState[gameID];
  if (room) {
    const game = room.gameEngine;
    const request = {
      method: game.assignRole,
      params: [player, role],
      callback: () => socket.join(gameID + '-' + role.split(" ")[1]),
    }
    execute(io, room, request);
  }
}

const unassign = (io, socket) => (gameID, player, role) => {
  const room = gameController.globalState[gameID];

  if (room) {
    const game = room.gameEngine;
    const request = {
      method: game.unassignRole,
      params: [player, role],
      callback: () => socket.leave(gameID + '-' + role.split(" ")[1]),
    }
    execute(io, room, request);
  }
}

const start = io => gameID => {
  const room = gameController.globalState[gameID];
  if (room) {
    const game = room.gameEngine;
    const timer = setInterval(() => {
      if (game.gameState.isEnd)
        clearInterval(timer);

      if (game.timerCountDown()) {
        const {cards, ...guesserState} = game.gameState;
        io.to(`${gameID}-spy`).emit('timer', {gameState: game.gameState, timer: game.gameState.timer});
        io.to(`${gameID}-guesser`).emit('timer', {gameState: guesserState, timer: game.gameState.timer});
      }
      else {
        io.to(gameID).emit('timer', {timer: game.gameState.timer});
      }
    }, 1000);
    const request = {
      method: game.start,
      params: [],
    }
    execute(io, room, request);
  }
  io.emit('publicGames', gameController.getPublicGames());
}

// Guesser's turn: Submit selected word
const guesserNextMove = io => (gameID, player, word) => {
  const room = gameController.globalState[gameID];
  if (room) {
    const game = room.gameEngine;
    const request = {
      method: game.guesserNextMove,
      params: [player, word],
      word: word,
    }
    execute(io, room, request);
  }
}

// Spymaster's turn: Submit hint and number of guesses
const spyNextMove = io => (gameID, player, hint, guesses) => {
  const room = gameController.globalState[gameID];
  if (room) {
    const game = room.gameEngine;
    const request = {
      method: game.spyNextMove,
      params: [player, hint, guesses],
    }
    execute(io, room, request);
  }
}

const endTurn = io => gameID => {
  const room = gameController.globalState[gameID];
  if (room) {
    const game = room.gameEngine;
    const request = {
      method: game.endTurn,
      params: [],
    }
    execute(io, room, request);
  }
}

const restartGame = io => gameID => {
  const room = gameController.globalState[gameID];
  if (room) {
    const game = room.gameEngine;
    const request = {
      method: game.restart,
      params: [],
    }
    execute(io, room, request);
  }
}

module.exports = {
  assign,
  unassign,
  start,
  guesserNextMove,
  spyNextMove,
  endTurn,
  restartGame,
}

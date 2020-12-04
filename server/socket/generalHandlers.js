const gameController = require('../controllers/game');

const leaveRoom = (room, socketID) => {
  if (room) {
    const activePlayers = room.activePlayers;
    const game = room.gameEngine;
    const newGameState = game.leave(activePlayers[socketID]);
    room.gameName = `${newGameState.host}\'s game`;
    delete activePlayers[socketID];
    // remove the game if there are no active players
    if (Object.keys(activePlayers).length === 0)
      delete gameController.globalState[room.id];

    return newGameState;
  }
  return undefined;
}

const disconnecting = (io, socket) => () => {
  const gameList = Array.from(socket.rooms).filter(item => item!=socket.id);
  console.log(`${socket.id} disconnecting`);
  // remove the player from room
  for (gameID of gameList) {
    const room = gameController.globalState[gameID];
    const newGameState = leaveRoom(room, socket.id);
    if (newGameState) {
      io.to(gameID).emit('update', {gameState: newGameState});
      io.emit('publicGames', gameController.getPublicGames());
    }
  }
};

const disconnect = (io, socket) => () => {
  console.log(`${socket.id} disconnected`);
};

const leave = (io, socket) => gameID => {
  const room = gameController.globalState[gameID];
  const newGameState = leaveRoom(room, socket.id);
  io.emit('publicGames', gameController.getPublicGames());
  if (newGameState)
    io.to(gameID).emit('update', {gameState: newGameState});
};

const refresh = io => () => {
  io.emit('publicGames', gameController.getPublicGames());
}

module.exports = {
  disconnecting,
  disconnect,
  leave,
  refresh
}

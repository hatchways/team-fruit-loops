const gameController = require('../controllers/game');

const disconnecting = (io, socket) => () => {
  const gameList = Array.from(socket.rooms).filter(item => item!=socket.id);
  console.log(`${socket.id} disconnecting`);
  // remove the player from room
  for (gameID of gameList) {
    if (gameController.globalState[gameID] === undefined) {
      console.log(`game (id: ${gameID}) does not exist.`);
      continue;
    }

    const activePlayers = gameController.globalState[gameID].activePlayers;
    // remove the player from the active player list
    delete activePlayers[socket.id];
    if (Object.keys(activePlayers).length === 0)
      delete gameController.globalState[gameID];
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
  io.emit('publicGames', gameController.getPublicGames());
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

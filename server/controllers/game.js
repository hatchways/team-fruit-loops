const Game = require('../game/game');
const { v4: uuidv4 } = require('uuid');
const globalState = {};

const validateGameId = (req, res, next) => {
  const id = req.params.id;
  if (globalState[id] === undefined)
    return res.status(404).json({error: `game id ${id} not found`});

  res.locals.game = globalState[id].gameEngine;
  next();
}

const ping = (req, res) => {
  return res.status(200).json({gameState: globalState[req.params.id].gameEngine.gameState});
}
const display = (req, res) => {
  return res.status(200).json({games: globalState})
}

const getPublicGames = () => {
  const gameList = [];
  try {
    for (game of Object.values(globalState)) {
      if (game.isPublic) {
        const gameState = game.gameEngine.gameState;
        gameList.push({
          id: game.id,
          gameName: game.gameName,
          maxPlayerNum: game.maxPlayerNum,
          host: gameState.host,
          playerNum: gameState.playerList.length,
          isStart: gameState.isStart,
        });
      }
    }
    return {gameList: gameList};
  }
  catch (e) {
    return {error: e.message};
  }
}

// create a new ID and game instance, register instance in global dict by ID
const create = (req, res) => {
  const {player, name = player + '\'s game', socketID, isPublic = false, maxPlayerNum = 8} = req.body;

  try {
    const id = uuidv4();
    const io = req.app.get('socketio');
    const socket = io.sockets.sockets.get(socketID);
    console.log(`Adding ${socket.id} to ${id}`);
    socket.join(id);

    const game = new Game(player);
    globalState[id] = {
      id: id,
      gameName: name,
      maxPlayerNum: maxPlayerNum,
      isPublic: isPublic,
      activePlayers: {
        [socketID]: player,
      },
      gameEngine: game,
    };
    io.emit('publicGames', getPublicGames());
    return res.status(201).json({id: id, gameState: game.gameState});
  }
  catch (e) {
    return res.status(400).json({error: e.message});
  }
}

// join adds player to game
const join = (req, res, next) => {
  const {player, socketID} = req.body;
  try {
    const io = req.app.get('socketio');
    const socket = io.sockets.sockets.get(socketID);
    const room = globalState[req.params.id]
    const activePlayers = Object.values(room.activePlayers)
    const playerList = room.gameEngine.gameState.playerList

    if (!activePlayers.includes(player) && playerList.includes(player)) {
      room.activePlayers[socketID] = player;
      socket.join(req.params.id);
      return res.status(200).json({gameState: room.gameEngine.gameState})
    }
    else {
      if (room.maxPlayerNum <= playerList.length)
        throw new Error(`There is no position available in ${room.gameName}`);

      const gameState = res.locals.game.join(player);
      room.activePlayers[socketID] = player;
      socket.join(req.params.id);
      console.log(`Adding ${socket.id} to ${req.params.id}`);

      io.to(req.params.id).emit('update', {gameState: gameState});
      io.emit('publicGames', getPublicGames());
      return res.status(200).json({gameState: gameState});
    }
  }
  catch (e) {
    return res.status(400).json({error: e.message});
  }
}

module.exports = {
  validateGameId,
  ping,
  getPublicGames,
  create,
  join,
  display,
  globalState,
}

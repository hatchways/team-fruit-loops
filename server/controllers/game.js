const authenticate = require("./authenticate");

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

const execute = (req, res) => {
  const method = res.locals.method;
  const params = res.locals.params;
  const io = req.app.get('socketio');
  if (res.locals.method === undefined || res.locals.params === undefined)
    next();

  try {
    const gameState = method.apply(res.locals.game, params);
    io.to(req.params.id).emit('update', gameState);
    if (process.env.NODE_ENV === "development") {
      console.log(`Emitting game state to ${req.params.id}`);
    }
    return res.status(200).json({gameState: gameState});
  }
  catch (e) {
    return res.status(400).json({error: e.message});
  }
}

const ping = (req, res) => {
  return res.status(200).json({gameState: globalState[req.params.id].gameEngine.gameState});
}
const display = (req, res) => {
  return res.status(200).json({games: globalState})
}

const getPublicGames = (req, res) => {
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
    return res.status(200).json({gameList: gameList});
  }
  catch (e) {
    return res.status(400).json({error: e.message});
  }
}

// create a new ID and game instance, register instance in global dict by ID
const create = (req, res) => {
  const {player, name = player + '\'s game', socketID, isPublic = false, maxPlayerNum = 8} = req.body;

  if (!isPublic && !authenticate.playerHasPrivateGames(player)) {
    return res.status(500).json({error: `Error creating games`});
  }

  try {
    const id = uuidv4();
    const socket = req.app.get('socketio').sockets.sockets.get(socketID);
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
    const io = req.app.get('socketio')
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

      io.to(req.params.id).emit('update', gameState);
      return res.status(200).json({gameState: gameState});
    }
  }
  catch (e) {
    return res.status(400).json({error: e.message});
  }
}

const assign = (req, res, next) => {
  const {player, role} = req.body;
  res.locals.method = res.locals.game.assignRole;
  res.locals.params = [player, role];
  next();
}

const unassign = (req, res, next) => {
  const {player, role} = req.body;
  res.locals.method = res.locals.game.unassignRole;
  res.locals.params = [player, role];
  next();
}

const start = (req, res, next) => {
  res.locals.method = res.locals.game.start;
  res.locals.params = [];

  const io = req.app.get('socketio');
  const game = res.locals.game;
  const timer = setInterval(() => {
    if (game.gameState.isEnd)
      clearInterval(timer);

    game.timerCountDown();
    io.to(req.params.id).emit('update', game.gameState);
  }, 1000);
  next();
}

const nextMove = (req, res, next) => {
  const {player, hint, word} = req.body;
  if (hint !== undefined) {
    res.locals.method = res.locals.game.spyNextMove;
    res.locals.params = [player, hint.word, hint.times];
  }
  else if (word !== undefined) {
    res.locals.method = res.locals.game.guesserNextMove;
    res.locals.params = [player, word];
  }
  else {
    throw new Error('Next move is not provided.');
  }

  next();
}

const endTurn = (req, res, next) => {
  res.locals.method = res.locals.game.endTurn;
  res.locals.params = [];
  next();
}

const restart = (req, res, next) => {
  res.locals.method = res.locals.game.restart;
  res.locals.params = [];
  next();
}

module.exports = {
  validateGameId,
  ping,
  getPublicGames,
  create,
  join,
  assign,
  unassign,
  start,
  nextMove,
  endTurn,
  restart,
  execute,
  display,
  globalState,
}

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
// create a new ID and game instance, register instance in global dict by ID
const create = (req, res) => {
  const {player, socketID, type, maxPlayerNum = 4} = req.body;

  try {
    const id = uuidv4();
    const socket = req.app.get('socketio').sockets.sockets.get(socketID);
    console.log(`Adding ${socket.id} to ${id}`);
    socket.join(id);

    const game = new Game(player);
    globalState[id] = {
      gameEngine: game,
      id: id,
      maxPlayerNum: maxPlayerNum,
      isPublic: type === 'public',
      activePlayers: {
        [socketID]: player,
      },
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
    console.log(`Adding ${socket.id} to ${req.params.id}`);
    socket.join(req.params.id);

    const room = globalState[req.params.id]
    const activePlayers = Object.values(room.activePlayers)
    const playerList = room.gameEngine.gameState.playerList
    console.log(activePlayers)
    if (!activePlayers.includes(player) && playerList.includes(player)) {
      room.activePlayers[socketID] = player;
      return res.status(200).json({gameState: room.gameEngine.gameState})
    }
    else {
      const gameState = res.locals.game.join(player);
      room.activePlayers[socketID] = player;
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

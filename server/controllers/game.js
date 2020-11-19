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
    return res.status(200).json({gameState: gameState});
  }
  catch (e) {
    return res.status(400).json({error: e.message});
  }
}

const ping = (req, res) => {
  return res.status(200).json({gameState: globalState[req.params.id].gameEngine.gameState});
}

// create a new ID and game instance, register instance in global dict by ID
const create = (req, res) => {
  const {player} = req.body;
  const id = uuidv4();

  try {
    const game = new Game(player);
    globalState[id] = {gameEngine: game, id: id}
    return res.status(201).json({id: id, gameState: game.gameState});
  }
  catch (e) {
    return res.status(400).json({error: e.message});
  }
}

// join adds player to game
const join = (req, res, next) => {
  const {player} = req.body;
  res.locals.method = res.locals.game.join;
  res.locals.params = [player];
  next();
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
  const game = req.locals.game;
  setInterval(() => {
    game.timerCountDown();
    io.emit('timer', game.gameState.timer);
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
}

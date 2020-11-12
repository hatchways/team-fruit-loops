const Game = require('../game/game');
const { v4: uuidv4 } = require('uuid');
const globalState = {};

const ping = (req, res) => {
  const {id} = req.params;
  if (globalState[id] === undefined)
    return res.status(404).json({error: `game id ${id} not found`});

  return res.status(200).json({gameState: globalState[id].gameEngine.gameState});
}

const create = (req, res) => {
  const {player} = req.body;
  const id = uuidv4();
  const game = new Game(player);
  globalState[id] = {
    gameEngine: game,
    id: id,
  }

  return res.status(201).json({
    id: id,
    gameState: game.gameState,
  });
}

const join = (req, res) => {
  const {id, player} = req.body;
  if (globalState[id] === undefined)
    return res.status(404).json({error: `game id ${id} not found`});

  const game = globalState[id].gameEngine;
  try {
    const gameState = game.join(player);
    return res.status(200).json({gameState: gameState});
  }
  catch (e) {
    return res.status(400).json({error: e.message});
  }
}

const assign = (req, res) => {
  const {id, player, role} = req.body;
  if (globalState[id] === undefined)
    return res.status(404).json({error: `game id ${id} not found`});

  const game = globalState[id].gameEngine;
  try {
    const gameState = game.assignRole(player, role);
    return res.status(200).json({gameState: gameState});
  }
  catch (e) {
    return res.status(400).json({error: e.message});
  }
}

const start = (req, res) => {
  const {id} = req.body;
  if (globalState[id] === undefined)
    return res.status(404).json({error: `game id ${id} not found`});

  const game = globalState[id].gameEngine;
  try {
    const gameState = game.start();
    return res.status(200).json({gameState: gameState});
  }
  catch (e) {
    return res.status(400).json({error: e.message});
  }
}

const nextMove = (req, res) => {
  const {id, player, hint, word} = req.body;
  if (globalState[id] === undefined)
    return res.status(404).json({error: `game id ${id} not found`});

  const game = globalState[id].gameEngine;
  try {
    let gameState;
    if (hint !== undefined)
      gameState = game.spyNextMove(player, hint.word, hint.times);
    else if (word !== undefined)
      gameState = game.guesserNextMove(player, word);
    else
      throw new Error('Next move is not provided.')

    return res.status(200).json({gameState: gameState})
  }
  catch (e) {
    return res.status(400).json({error: e.message});
  }
}

module.exports = {
  ping,
  create,
  join,
  assign,
  start,
  nextMove,
}

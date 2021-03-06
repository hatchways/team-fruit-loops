const dictionary = require('./dictionary/dictionary');
const shuffle = require('./utils/shuffle');
const role = require('./role');
const INIT_TIMER = parseInt(process.env.INIT_GAME_TIMER) || 20;
const INIT_GUESS_CHANCE = parseInt(process.env.INIT_GUESS_CHANCE) || 1;

// Initialize game with 4 players and roles are randomly assigned
const initGame = () => {
  const gameState = {
    cards: dictionary.generateCards(),
    blueCardNum: 9,
    redCardNum: 8,
    greyCardNum: 7,
    blackCardNum: 1,
    bluePoints: 9,
    redPoints: 8,
    turn: 'blue',
    guessNum: INIT_GUESS_CHANCE,
    hint: undefined,
    isEnd: false,
    winner: undefined,
    boardState: {},
    timer: INIT_TIMER,
  };

  for (let key in gameState.cards)
    gameState.boardState[key] = { status: 'covered' };

  return gameState;
}

const isReady = (gameState) => {
  return (
    gameState.blueSpy !== undefined &&
    gameState.redSpy !== undefined &&
    gameState.blueGuessers.length !== 0 &&
    gameState.redGuessers.length !== 0
  );
}

// Game constructor. Initialize players info of game state.
function Game(creator) {
  if (creator === undefined)
    throw new Error('Player is not provided.');

  this.gameState = {
    playerList: [creator],
    waitingList: [creator],
    host: creator,
    redSpy: undefined,
    redGuessers: [],
    blueSpy: undefined,
    blueGuessers: [],
    isReady: false,
    isStart: false,
  };
}

Game.prototype.join = function(player) {
  if (player === undefined)
    throw new Error('Player is not provided.');

  if (this.gameState.playerList.includes(player))
    throw new Error(`${player} has already joined in the game.`);

  if (this.gameState.isStart)
    throw new Error('Game has already started.');

  this.gameState.playerList.push(player);
  this.gameState.waitingList.push(player);
  return this.gameState;
}

Game.prototype.leave = function(player) {
  const gameState = this.gameState;
  if (gameState.isStart) return gameState;

  if (player !== undefined && gameState.playerList.includes(player)) {
    if (gameState.waitingList.includes(player)) {
      this.gameState.waitingList.splice(gameState.waitingList.indexOf(player), 1);
    }
    else {
      if (gameState.blueSpy === player) this.gameState.blueSpy = undefined;
      if (gameState.redSpy === player) this.gameState.redSpy = undefined;
      if (gameState.blueGuessers.includes(player))
        this.gameState.blueGuessers.splice(gameState.blueGuessers.indexOf(player), 1);
      if (gameState.redGuessers.includes(player))
        this.gameState.redGuessers.splice(gameState.redGuessers.indexOf(player), 1);
    }
    this.gameState.playerList.splice(gameState.playerList.indexOf(player), 1);
    if (!this.gameState.playerList.includes(this.gameState.host)) {
      if (this.gameState.playerList.length > 0)
        this.gameState.host = this.gameState.playerList[0];
    }
  }
  return this.gameState;
}

Game.prototype.assignRole = function(player, newRole) {
  const waitingList = this.gameState.waitingList;
  if (this.gameState.isStart)
    throw new Error('Game has already started.');
  if (!this.gameState.playerList.includes(player))
    throw new Error(`Failed to assign role: ${player} is an invalid player.`);
  if (!waitingList.includes(player))
    throw new Error(`Failed to assign role: ${player} has been assigned.`);

  switch(newRole) {
    case role.RED.SPY:
      if (this.gameState.redSpy !== undefined)
        throw new Error(`${newRole} has been assigned.`);
      else
        this.gameState.redSpy = player;
      break;

    case role.RED.GUESSER:
      this.gameState.redGuessers.push(player);
      break;

    case role.BLUE.SPY:
      if (this.gameState.blueSpy !== undefined)
        throw new Error(`${newRole} has been assigned.`);
      else
        this.gameState.blueSpy = player;
      break;

    case role.BLUE.GUESSER:
      this.gameState.blueGuessers.push(player);
      break;

    default:
      throw new Error(`Failed to assign role: ${newRole} is invalid.`);
  }
  this.gameState.waitingList.splice(waitingList.indexOf(player), 1);
  this.gameState.isReady = isReady(this.gameState);
  return this.gameState;
}

Game.prototype.unassignRole = function(player, oldRole) {
  const redGuessersList = this.gameState.redGuessers;
  const blueGuessersList = this.gameState.blueGuessers;
  if (this.gameState.isStart)
    throw new Error('Game has already started.');
  if (!this.gameState.playerList.includes(player))
    throw new Error(`Failed to assign role: ${player} is an invalid player.`);

  switch(oldRole) {
    case role.RED.SPY:
      if (this.gameState.redSpy !== player)
        throw new Error(`${player} was not a ${role.RED.SPY}.`);
      else
        this.gameState.redSpy = undefined;
      break;

    case role.RED.GUESSER:
      if (!redGuessersList.includes(player))
        throw new Error(`${player} was not a ${role.RED.GUESSER}.`);
      else
        this.gameState.redGuessers.splice(redGuessersList.indexOf(player), 1);
      break;

    case role.BLUE.SPY:
      if (this.gameState.blueSpy !== player)
        throw new Error(`${player} was not a ${role.BLUE.SPY}.`);
      else
        this.gameState.blueSpy = undefined;
      break;

    case role.BLUE.GUESSER:
      if (!blueGuessersList.includes(player))
        throw new Error(`${player} was not a ${role.BLUE.GUESSER}.`);
      else
        this.gameState.blueGuessers.splice(blueGuessersList.indexOf(player), 1);
      break;

    default:
      throw new Error(`Failed to assign role: ${newRole} is invalid.`);
  }
  this.gameState.waitingList.push(player);
  this.gameState.isReady = isReady(this.gameState);
  return this.gameState;
}

// Initialize game state and start game
Game.prototype.start = function() {
  if (!this.gameState.isReady)
    throw new Error('Role assignment is not finished yet.');
  if (this.gameState.isStart)
    throw new Error('Game has already started.');

  Object.assign(this.gameState, initGame());
  this.gameState.isStart = true;
  return this.gameState;
}

// A guesser's next move
Game.prototype.guesserNextMove = function(player, word) {
  if (!this.gameState.isStart || this.gameState.isEnd)
    throw new Error('Game is not started yet');

  const turn = this.gameState.turn;
  if (turn === 'red' && !this.gameState.redGuessers.includes(player))
    throw new Error(`${player} is not a guesser from team red.`);

  if (turn === 'blue' && !this.gameState.blueGuessers.includes(player))
    throw new Error(`${player} is not a guesser from team blue.`);

  if (this.gameState.hint === undefined)
    throw new Error('A guesser must wait until a spy gives hints.');

  this.gameState.boardState[word].status = this.gameState.cards[word];
  switch(this.gameState.cards[word]) {
    // if select a black card, ends game and the opponent wins.
    case 'black':
      this.gameState.isEnd = true;
      this.gameState.winner = turn === 'red' ? 'blue' : 'red';
      break;
    // if select a blue card, increase blue point and make turn to blue team.
    case 'blue':
      this.gameState.bluePoints--;
      this.gameState.guessNum--;
      if (this.gameState.guessNum === 0)
        return this.endTurn();

      if (this.gameState.turn === 'red') {
        return this.endTurn();
      } else {
          // Reset game timer between each move
          this.gameState.timer = INIT_TIMER;
      }

      this.gameState.turn = 'blue';
      if (this.gameState.bluePoints === 0) {
        this.gameState.isEnd = true;
        this.gameState.winner = 'blue';
      }
      break;
    // if select a red card, increase red point and make turn to red team.
    case 'red':
      this.gameState.redPoints--;
      this.gameState.guessNum--;
      if (this.gameState.guessNum === 0)
        return this.endTurn();

      if (this.gameState.turn === 'blue') {
        return this.endTurn();
      }

      if (this.gameState.redPoints === 0) {
        this.gameState.isEnd = true;
        this.gameState.winner = 'red';
      } else {
        // Reset game timer between each move
        this.gameState.timer = INIT_TIMER;
      }

      break;
    // if select a grey card(innocent card), make turn to the opponent
    case 'grey':
      return this.endTurn();
    default:
      throw new Error(`${word} is not a word in this game.`);
  }

  return this.gameState;
}

// A spy's next move
Game.prototype.spyNextMove = function(player, hint, hintNum) {
  if (!this.gameState.isStart || this.gameState.isEnd)
    throw new Error('Game is not started yet');
  if (this.gameState.turn === 'red' && player !== this.gameState.redSpy)
    throw new Error(`${player} is not a red spy.`);

  if (this.gameState.turn === 'blue' && player !== this.gameState.blueSpy)
    throw new Error(`${player} is not a blue spy.`);

  if (this.gameState.hint !== undefined)
    throw new Error(`${this.gameState.turn} spy has already given a hint.`);

  if (typeof(hintNum) !== 'number')
    throw new Error(`hitNum is not a number: ${hintNum}`);

  if (hintNum <= 0)
    throw new Error('Invalid number of hints');

  if (this.gameState.cards[hint.toLowerCase()])
    throw new Error('Cannot give a card word as a hint');

  this.gameState.hint = hint.toLowerCase();
  this.gameState.guessNum = hintNum + this.gameState.guessNum;

  // Reset game timer for guessers
  this.gameState.timer = INIT_TIMER;

  return this.gameState;
}

Game.prototype.endTurn = function() {
  if (!this.gameState.isStart || this.gameState.isEnd)
    throw new Error('Game is not started yet');

  if (this.gameState.redPoints === 0) {
    this.gameState.isEnd = true;
    this.gameState.winner = 'red';
  }
  if (this.gameState.bluePoints === 0) {
    this.gameState.isEnd = true;
    this.gameState.winner = 'blue';
  }
  this.gameState.turn = this.gameState.turn === 'red' ? 'blue' : 'red';
  this.gameState.guessNum = INIT_GUESS_CHANCE;
  this.gameState.hint = undefined;
  this.gameState.timer = INIT_TIMER;
  return this.gameState;
}

Game.prototype.isEnd = function() {
  return this.gameState.isEnd;
}

Game.prototype.restart = function () {
  if (!this.gameState.isStart)
    throw new Error('Game is not started yet');

  Object.assign(this.gameState, initGame());
  return this.gameState;
}

Game.prototype.timerCountDown = function() {
  if (!this.gameState.isStart || this.gameState.isEnd) return;
  if (this.gameState.timer <= 0) {
    this.gameState.timer = INIT_TIMER;
    this.endTurn();
    return true;
  }
  else {
    this.gameState.timer--;
  }
  return false;
}

module.exports = Game;

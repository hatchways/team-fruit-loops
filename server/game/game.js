const dictionary = require('./dictionary/dictionary');
const shuffle = require('./utils/shuffle');

// Initialzie game with 4 players and roles are randomly assigned
const initGame = (playerList) => {
  const gameState = {
    cards: dictionary.generateCards(),
    blueCardNum: 8,
    redCardNum: 8,
    whiteCardNum: 8,
    blackCardNum: 1,
    playerList: new Set(playerList),
    redSpy: undefined,
    redGuessers: [],
    redPoints: 0,
    blueSpy: undefined,
    blueGuessers: [],
    bluePoints: 0,
    turn: 'blue',
    guessNum: 0,
    hint: undefined,
    isEnd: false,
    winner: undefined,
    boardState: {},
  };

  const shuffledPlayerList = shuffle(Array.from(gameState.playerList));
  gameState.redSpy = shuffledPlayerList[0];
  gameState.blueSpy = shuffledPlayerList[1];
  gameState.redGuessers.push(shuffledPlayerList[2]);
  gameState.blueGuessers.push(shuffledPlayerList[3]);

  for (let key in gameState.cards) {
    gameState.boardState[key] = {
      status: 'covered',
    }
  }

  return gameState;
}

// Game constructor with 4 players
function Game(playerList) {
  if (playerList.length !== 4)
    throw new Error('Number of players must be 4');

  this.gameState = initGame(playerList);
}

// A guesser's next move
Game.prototype.guesserNextMove = function(player, word) {
  const turn = this.gameState.turn;
  if (turn === 'red' && !this.gameState.redGuessers.includes(player))
    throw new Error(`${player} is not a guesser from team red.`);

  if (turn === 'blue' && !this.gameState.blueGuessers.includes(player))
    throw new Error(`${player} is not a guesser from team blue.`);

  if (this.gameState.hint === undefined)
    throw new Error('A guesser must wait until a spy gives hints.');

  const wordIdentity = this.gameState.cards[word];
  this.gameState.boardState[word].status = this.gameState.cards[word];

  switch(wordIdentity) {
    // if select a black card, ends game and the opponent wins.
    case 'black':
      this.gameState.isEnd = true;
      this.gameState.winner = turn === 'red' ? 'blue' : 'red';
      break;
    // if select a blue card, increase blue point and make turn to blue team.
    case 'blue':
      this.gameState.bluePoints++;
      this.gameState.guessNum--;
      if (this.gameState.guessNum === 0)
        return this.endTurn();

      this.gameState.turn = 'blue';
      if (this.gameState.bluePoints === this.gameState.blueCardNum) {
        this.gameState.isEnd = true;
        this.gameState.winner = 'blue';
      }
      break;
    // if select a red card, increase red point and make turn to red team.
    case 'red':
      this.gameState.redPoints++;
      this.gameState.guessNum--;
      if (this.gameState.guessNum === 0)
        return this.endTurn();

      this.gameState.turn = 'red';
      if (this.gameState.redPoints === this.gameState.redCardNum) {
        this.gameState.isEnd = true;
        this.gameState.winner = 'red';
      }
      break;
    // if select a white card(innocent card), make turn to the opponent
    case 'white':
      return this.endTurn();
    default:
      throw new Error(`${word} is not a word in this game.`);
  }

  return this.gameState;
}

// A spy's next move
Game.prototype.spyNextMove = function(player, hint, hintNum) {
  if (this.gameState.turn === 'red' && player !== this.gameState.redSpy)
    throw new Error(`${player} is not a red spy.`);

  if (this.gameState.turn === 'blue' && player !== this.gameState.blueSpy)
    throw new Error(`${player} is not a blue spy.`);

  if (this.gameState.hint !== undefined)
    throw new Error(`${this.gameState.turn} spy has already given a hint.`);

  if (hintNum <= 0)
    throw new Error('Invalid number of hints');

  this.gameState.hint = hint;
  this.gameState.guessNum = hintNum + 1;
  return this.gameState;
}

Game.prototype.endTurn = function() {
  this.gameState.turn = this.gameState.turn === 'red' ? 'blue' : 'red';
  this.gameState.guessNum = 0;
  this.gameState.hint = undefined;
  return this.gameState;
}

Game.prototype.isEnd = function() {
  return this.gameState.isEnd;
}

Game.prototype.restart = function () {
  this.gameState = initGame(Array.from(this.gameState.playerList));
  return this.gameState;
}

module.exports = Game;

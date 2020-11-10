const dictionary = require('./dictionary/dictionary');
const shuffle = require('./utils/shuffle');

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
    turn: 'blue', //Math.random() - 0.5 > 0 ? 'red' : 'blue',
    isEnd: false,
    winner: undefined,
    boardState: {},
  };

  const shuffledPlayerList = shuffle(Array.from(gameState.playerList));
  gameState.redSpy = shuffledPlayerList[0];
  gameState.blueSpy = shuffledPlayerList[1];
  gameState.redGuessers.push(shuffledPlayerList[2]);
  gameState.blueGuessers.push(shuffledPlayerList[3]);

  for (key in gameState.cards) {
    gameState.boardState[key] = {
      status: 'covered',
      voteList: [],
    }
  }

  return gameState;
}

function Game(playerList) {
  if (playerList.length !== 4)
    throw new Error('Number of players must be 4');

  this.gameState = initGame(playerList);
}

Game.prototype.nextMove = function(player, word) {
  const turn = this.gameState.turn;
  if (turn === 'red' && !this.gameState.redGuessers.includes(player))
    throw new Error(`${player} is not a guesser from team red.`);

  if (turn === 'blue' && !this.gameState.blueGuessers.includes(player))
    throw new Error(`${player} is not a guesser from team blue.`);

  const wordIdentity = this.gameState.cards[word];
  switch(wordIdentity) {
    // if select a black card, ends game and the opponent wins.
    case 'black':
      this.gameState.isEnd = true;
      this.gameState.winner = turn === 'red' ? 'blue' : 'red';
      break;
    // if select a blue card, increase blue point and make turn to blue team.
    case 'blue':
      this.gameState.bluePoints++;
      this.gameState.turn = 'blue';
      if (this.gameState.bluePoints === this.gameState.blueCardNum) {
        this.gameState.isEnd = true;
        this.gameState.winner = 'blue';
      }
      break;
    // if select a red card, increase red point and make turn to red team.
    case 'red':
      this.gameState.redPoints++;
      this.gameState.turn = 'red';
      if (this.gameState.redPoints === this.gameState.redCardNum) {
        this.gameState.isEnd = true;
        this.gameState.winner = 'red';
      }
      break;
    // if select a white card, make turn to the opponent
    case 'white':
      this.gameState.turn = turn === 'red' ? 'blue' : 'red';
      break;
    default:
      throw new Error(`${word} is not a word in this game.`);
  }

  this.gameState.boardState[word].status = this.gameState.cards[word];
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

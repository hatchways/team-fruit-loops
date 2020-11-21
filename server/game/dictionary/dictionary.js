const fs = require('fs');
const shuffle = require('../utils/shuffle');

// read word list from the file and store words in an array
const file = __dirname + '/nounlist.txt';
const data = fs.readFileSync(file, 'utf8');
const wordList = data.trim().split(/\s+/);

/**
 * Used Fisher–Yates shuffle method to shuffle a given array and
 * return an array with given size.
 *
 * @param {number} size Number of cards to be generated
 * @param {number} blue Number of blue agent
 * @param {number} red Number of red agent
 * @param {number} black number of assasin
 * @returns {dict} A dict where keys are words and value is
                   identity of the word.
 */
const generateCards = (size = 25, blue = 8, red = 8, black = 1) => {
  if (blue + red + black > size) {
    throw new Error('Invalid number of blue, red or black cards.');
  }

  //
  const identityList = [
    ...Array(blue).fill('blue'),
    ...Array(red).fill('red'),
    ...Array(black).fill('black'),
    ...Array(size - blue - red - black).fill('grey')
  ];

  // shuffle words and identities, then associate each word with an identity.
  const shuffledWordList = shuffle(wordList, size);
  const shuffledIdentityList = shuffle(identityList);
  const cards = {};

  for (let i = 0; i < size; i++) {
    cards[shuffledWordList[i]] = shuffledIdentityList[i];
  }

  return cards;
}

module.exports = {
  generateCards,
}

const fs = require('fs');

// read word list from the file and store words in an array
const file = './nounlist.txt';
const data = fs.readFileSync(file, 'utf8');
const wordList = data.trim().split(/\s+/);

/**
 * Used Fisher–Yates shuffle method to shuffle a given array.
 * Return an array with given size.
 *
 * @param {array} array The array to be shuffled
 * @param {number} size Number of elements to be shuffled
 * @returns {array} Shuffled array with given size
 */
const shuffle = (array, size = array.length) => {
  // force size to be size of array if it is larger than the size of array.
  if (size > array.length) size = array.length;

  // swap arr[i] and arr[j] in every iteration where j is random from 0 to i.
  for (let i = array.length - 1; i >= array.length - size; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let tmp = array[i];
    array[i] = array[j];
    array[j] = tmp;
  }

  return array.slice(array.length - size, array.length);
}

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
  const colorList = [];
  if (blue + red + black > size) {
    throw 'Invalid number of blue, red or black cards.'
  }

  for (let i = 0; i < blue; i++) {
    colorList.push("blue");
  }

  for (let i = 0; i < red; i++) {
    colorList.push("red");
  }

  for (let i = 0; i < black; i++) {
    colorList.push("black");
  }

  for (let i = 0; i < size - (blue + red + black); i++) {
    colorList.push("white");
  }

  // shuffle words and identities, then associate each word with an identity.
  const shuffledwordList = shuffle(wordList, size);
  const shuffledColorList = shuffle(colorList);
  const cards = {};

  for (let i = 0; i < size; i++) {
    cards[shuffledwordList[i]] = shuffledColorList[i];
  }

  return cards;
}

module.exports = {
  generateCards,
}

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

module.exports = shuffle;

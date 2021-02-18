const genRandom = function() {
  /* thank you to our music_library assignment, keeping it alphanumeric, no zeroes, limit to 6 characters */
    return Math.random().toString(36).replace('0.', '').substr(2, 6);
};



module.exports = { genRandom };
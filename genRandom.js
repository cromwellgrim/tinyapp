const genRandom = function() {
  /* create random character (Math.random) send it to a string (toString) don't want 0s (replace)
  and limit to 6 characters until string.length = 6 (substr) used 2 methods found online and combined!
  https://dev.to/oyetoket/fastest-way-to-generate-random-strings-in-javascript-2k5a
  */
    return Math.random().toString(36).replace('0.', '').substr(2, 6);
};



module.exports = { genRandom };
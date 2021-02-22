const genRandom = function() {
  /* thank you to our music_library assignment, keeping it alphanumeric, no zeroes, limit to 6 characters */
    return Math.random().toString(36).replace('0.', '').substr(2, 6);
};

const emailLookup = function(email, users) {
  for (let each in users) {
    if(email === users[each].email) {
      return users[each]
    }
  }
  return false
};

const loginLookup = function(password, users) {
  for (let each in users) {
    if(password === users[each].password) {
      return users[each]
    }
  }
  return false
};





module.exports = { genRandom, emailLookup, loginLookup };
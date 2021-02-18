const genRandom = function() {
  /* thank you to our music_library assignment, keeping it alphanumeric, no zeroes, limit to 6 characters */
    return Math.random().toString(36).replace('0.', '').substr(2, 6);
};

const emailLookup = function(email, users) {
  for (let each in users) {
    if(email === users[each].email) {
      return 'this email is already in use';
    }
  }
  return 'good to go'
};

const loginLookup = function(login, users) {
  for (let each in users) {
    if(login === users[each].login) {
      return 'good to go'
    }
  }
  return 'bad password'
};





module.exports = { genRandom, emailLookup, loginLookup };



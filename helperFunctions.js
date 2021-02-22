const genRandom = function() {
  /* thank you to our music_library assignment, keeping it alphanumeric, no zeroes, limit to 6 characters */
    return Math.random().toString(36).replace('0.', '').substr(2, 6);
};

const emailLookup = function(email, users) {
  return Object.keys(users).find(id => users[id]["email"] === email);
};

const urlsOfUser = function(urls, user) {
  let urlsToDisplay = {};
  let arrayForUser = [];
  for (const each in urls) {
    if (urls[each]["userID"] === user){
      urlsToDisplay[each] = {longURL: urls[each]["longURL"]}
    }
  }
  return urlsToDisplay
};




module.exports = { genRandom, emailLookup, urlsOfUser };
/* generates a random string for users and shortURLs */
const genRandom = function() {
  /* thank you to our music_library assignment, keeping it alphanumeric, no zeroes, limit to 6 characters */
  return Math.random().toString(36).replace("0.", "").substr(2, 6);
};

/* emailLookup searches through the key:value pair of the users to find if their email matches the input */
const emailLookup = function(email, users) {
  return Object.keys(users).find((id) => users[id]["email"] === email);
};

/* urlsOfUser searchs through to discover the urls of the user and add them to the db */
const urlsOfUser = function(urls, user) {
  let urlsToDisplay = {};
  for (const each in urls) {
    if (urls[each]["userID"] === user) {
      urlsToDisplay[each] = { longURL: urls[each]["longURL"] };
    }
  }
  return urlsToDisplay;
};

module.exports = { genRandom, emailLookup, urlsOfUser };

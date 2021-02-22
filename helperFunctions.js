const genRandom = function() {
  /* thank you to our music_library assignment, keeping it alphanumeric, no zeroes, limit to 6 characters */
    return Math.random().toString(36).replace('0.', '').substr(2, 6);
};

const emailLookup = function(email, users) {
  return Object.keys(users).find(id => users[id]["email"] === email);
};

const urlsOfUser = function(urls, user) {
  let urlsToDisplay = {};
  console.log(Object.keys(urls))
  const shortUrlsArr = (urls, val) => Object.keys(urls).filter(key => {
    console.log(urls[key])
    console.log(urls[key]["userID"])
    urls[key]["userID"] === val
  });
  let arrayForUser = shortUrlsArr(urls, user)
  console.log("********")
  console.log(arrayForUser)
  console.log("********")
  for (let i of arrayForUser) {
    console.log(i)
    urlsToDisplay[i] = urls[i]["longURL"]
  }
  console.log(urlsToDisplay)
  return urlsToDisplay

  
};




module.exports = { genRandom, emailLookup, urlsOfUser };
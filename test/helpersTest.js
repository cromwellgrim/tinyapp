const { assert } = require('chai');

const { emailLookup, urlsOfUser } = require('../helperFunctions.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

const testUserID = "userRandomID";

const urlDatabase = {
  "b2xVn2": { longURL: "http://www.lighthouselabs.ca", userID: "userRandomID"},
  "9sm5xK": { longURL: "http://www.google.ca", userID: "userRandomID"  }
};

describe('emailLookup', function() {
  it('should return a user with valid email', function() {
    const user = emailLookup("user@example.com", testUsers)
    const expectedOutput = "userRandomID";

    assert.equal(user, expectedOutput, 'user should be userRandomID');
  });
  it('should return undefined', function () {
    const user = emailLookup(testUsers, "test@mail.ca");
    assert.isUndefined(user);
  });
});

describe('urlsOfUser', function() {
  it("should return an object with the user's urls", function() {
    const urls = urlsOfUser(urlDatabase, testUserID)
    expectedOutput = {
      "b2xVn2": { longURL: 'http://www.lighthouselabs.ca' },
      '9sm5xK': { longURL: 'http://www.google.ca' }
    }
    assert.deepEqual(urls, expectedOutput)
  });
});


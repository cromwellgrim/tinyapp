const express = require('express');
const app = express();
const PORT = 8080;
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');
const { genRandom, emailLookup, urlsOfUser } = require('./helperFunctions');


app.use(cookieSession({
  name: 'session',
  keys:['key1', 'key2']
}));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

// global variables

const users = {
  "userOne": {
    id: "userRandomID",
    email: "user@example.com",
    // super secret password: asdf
    password: "$2b$10$1jSz1rBL8w.zvZzkGjljieCVzSqoyDm1zAOE3Vwj1bGxIJlAF5Gg6"
  },
  "userTwo": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "example2"
  }
};

const urlDatabase = {
  'b2xVn2': { longURL: "http://www.lighthouselabs.ca", userID: "userRandomID" },
  '9sm5xK': { longURL: "http://www.google.ca", userID: "userRandomID" }
};


// home page

app.get("/", (req, res) => {
  res.redirect("/urls");
});

app.get("/urls", (req, res) => {
  if (req.session.userID === undefined) {
    res.redirect("/urls/login");
  } else {
    const activeUser = req.session.userID;
    const urlsToDisplay = urlsOfUser(urlDatabase, activeUser.id);
    const templateVars = { urls: urlsToDisplay, user: req.session.userID };
    res.render("urls_index", templateVars);
  }
});

// login page

app.get("/urls/login", (req, res) => {
  const activeUser = req.session.userID;
  if (!activeUser) {
    return res.render("urls_login");
  }
  
  const templateVars = { urls: urlDatabase, user: activeUser };
  res.render("urls_index", templateVars);
});

app.post("/urls/login", (req, res) => {
  let activeUser = emailLookup(req.body.email, users);
  if (emailLookup(req.body.email, users)) {
    if (bcrypt.compareSync(req.body["password"], users[activeUser]["password"])) {
      req.session.userID = users[activeUser];
      const templateVars = { urls: urlDatabase, user: activeUser };
      res.render("urls_index", templateVars);
    }
  } else {
    res.status(403).send("login issue");
  }
});

// register page

app.get("/urls/register", (req, res) => {
  const activeUser = req.session.userID;
  const templateVars = { urls: urlDatabase, user: activeUser};
  res.render("urls_register", templateVars);
});

app.post("/urls/register", (req, res) => {
  if (!emailLookup(req.body.email, users)) {
    const id = genRandom();
    const hashedPass = bcrypt.hashSync(req.body.password, 10);
    users[id] = {
      id: id,
      email: req.body.email,
      password: hashedPass
    };
    req.session.userID = users[id];
    res.redirect("/urls");
  }
  if (req.body.email === '' || req.body.password === '') {
    return res.status(400).send('400 error, please fill in all fields');
  }
  if (emailLookup(req.body.email, users)) {
    return res.status(400).send('400 error, email already in use');
  }
  res.redirect("/urls");
});

// logout and clear user

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");
});

// create new URL

app.get("/urls/new", (req, res) => {
  const templateVars = { urls: urlDatabase, user: req.session.userID };
  const activeUser = req.session.userID;
  if (activeUser === undefined) {
    return res.redirect("/urls");
  }
  res.render("urls_new", templateVars);
});

// shortURL routing and functionality

app.get("/urls/:shortURL", (req, res) => {
  if (req.session.userID !== undefined) {
    const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL]["longURL"], user: req.session.userID };
    res.render("urls_show", templateVars);
  } else {
    res.redirect("/urls");
  }
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL]["longURL"];
  res.redirect(longURL);
});

app.post("/urls/", (req, res) => {
  if (req.session.userID) {
    const shortURL = genRandom();
    const longURL = req.body.longURL;
    urlDatabase[shortURL] = {
      longURL: longURL,
      userID: req.session.userID["id"]
    };
    res.redirect(`/urls/${shortURL}`);
  } else {
    res.redirect("/urls/login");
  }
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect("/urls");
});

app.post("/urls/:id/edit", (req, res) => {
  const newlongURL = req.body.longURL;
  const shortURL = req.body.shortURL;
  urlDatabase[shortURL].longURL = newlongURL;
  const templateVars = { urls: { shortURL: newlongURL }, user: req.session.userID };
  res.render("urls_index", templateVars);
});

app.post("*", (req, res) => {
  res.status(404).send("FOUR ZERO FOUR");
});

app.listen(PORT, () => {
  console.log(`TinyApp listening on port ${PORT}!`);
});
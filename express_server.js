const express = require('express');
const app = express();
const PORT = 8080; 
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const bcrypt - require('bcrypt');
const { genRandom, emailLookup, loginLookup } = require('./helperFunctions'); 


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
    password: "example"
  },
  "userTwo": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "example2"
  }
};

const urlDatabase = {
  "b2xVn2": { longURL: "http://www.lighthouselabs.ca", id: users },
  "9sm5xK": { longURL: "http://www.google.ca", id: users }
};


// home page

app.get("/", (req, res) => {
  res.render("urls_index");
});

app.get("/urls", (req, res) => {
  const activeUser = req.session.user
  // const shortURL = urlDatabase["b2xVn2"]
  // const longURL = shortURL.longURL
  const templateVars = { urls: urlDatabase, user: users[activeUser] };
  res.render("urls_index", templateVars);
});

// login page

app.get("/urls/login", (req, res) => {
  const activeUser = req.session.user
  const templateVars = { urls: urlDatabase, user: users[activeUser] };
  res.render("urls_login", templateVars);
});

app.post("/urls/login", (req, res) => {
  if(emailLookup(req.body.email, users) && loginLookup(req.body.password, users)) {
    let activeUser = emailLookup(req.body.email, users);
    let id = activeUser.id
    return res.cookie('user', id).redirect("/urls");
  }
  res.status(403).send("login issue");
});

// register page

app.get("/urls/register", (req, res) => {
  const activeUser = req.session.user
  const templateVars = { urls: urlDatabase, user: users[activeUser] };
  res.render("urls_register", templateVars);
});

app.post("/urls/register", (req, res) => {
  if(!emailLookup(req.body.email, users)) {
    const id = genRandom();
    users[id] = { 
      id: id,
      email: req.body.email,
      password: req.body.password
    };
    console.log(users);
    return res.cookie('user', id).redirect("/urls");
  }
  if(req.body.email === '' || req.body.password === '') {
    return res.status(400).send('400 error, please fill in all fields');
  }
  if(emailLookup(req.body.email, users)){
    return res.status(400).send('400 error, email already in use');
  } 
  res.redirect("/urls");
});

// logout and clear user

app.post("/logout", (req, res) => {
  const user = { user: req.session.user};
  res.cookie('user', user).clearCookie('user', user).redirect("/urls");
});

// create new URL

app.get("/urls/new", (req, res) => {
  const templateVars = { urls: urlDatabase, user: req.session.user }
  const activeUser = req.session.user
  console.log("new", urlDatabase)
  if(activeUser === undefined) {
    return res.redirect("/urls");
  }
  res.render("urls_new", templateVars);
})

// shortURL routing and functionality

app.get("/urls/:shortURL", (req, res) => {
  console.log("shortURL", urlDatabase)
  const templateVars = { shortURL: req.body.shortURL, longURL: urlDatabase[req.body.shortURL]["longURL"], user: req.session.user };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL]["longURL"];
  res.redirect(longURL);
});

app.post("/urls/", (req, res) => {
  const shortURL = genRandom();
  const longURL = req.body.longURL;
  urlDatabase[shortURL]["longURL"] = longURL;
  console.log("at longURL in gen", urlDatabase)
  res.redirect(`/urls/${shortURL}`);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect("/urls");
});

app.post("/urls/:id/edit", (req, res) => {
  const longURL = req.body.longURL;
  const shortURL = req.body.shortURL;
  urlDatabase[shortURL] = longURL;
  res.redirect("/urls");
});

app.post("*", (req, res) => {
  res.status(404).send("FOUR ZERO FOUR")
});

app.listen(PORT, () => {
  console.log(`TinyApp listening on port ${PORT}!`);
});
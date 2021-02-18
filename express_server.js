const express = require('express');
const app = express();
const PORT = 8080; 
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const { genRandom, emailLookup, loginLookup } = require('./helperFunctions'); 


app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

// "global" variables

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "example"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "example2"
  }
};

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.ca"
};

// home page

app.get("/", (req, res) => {
  res.render("urls_index");
});

app.get("/urls", (req, res) => {
  const activeUser = req.cookies.user_id
  const templateVars = { urls: urlDatabase, user: users[activeUser] };
  res.render("urls_index", templateVars);
});

// login page

app.get("/urls/login", (req, res) => {
  const activeUser = req.cookies.user_id
  const templateVars = { urls: urlDatabase, user: users[activeUser] };
  res.render("urls_login", templateVars);
});

app.post("/urls/login", (req, res) => {
  const activeUser = req.cookies.user_id
  if((loginLookup(req.body.email, req.cookies.user_id)) && (loginLookup(req.body.password, req.cookies.user_id))) {
    res.cookie('user', users[id].email)
    res.redirect("/urls");
  }
  else {
    res.status(403);
    res.send('403 error, no account found');
  }
});

// register page

app.get("/urls/register", (req, res) => {
  const activeUser = req.cookies.user_id
  const templateVars = { urls: urlDatabase, user: users[activeUser] };
  res.render("urls_register");
});

app.post("/urls/register", (req, res) => {
  const id = genRandom()
  users[id] = { id: id,
    email: req.body.email,
    password: req.body.password
  };
  res.cookie('user', users[id]);
  if(users[id].email === '' || users[id].password === '') {
    res.status(400);
    res.send('400 error, please fill in all fields');
  }
  if(emailLookup(req.body.email, users)){
    res.status(400);
    res.send('400 error, email already in use');
  } 
  else {
    res.redirect("/urls");
  }
});

// logout and clear user_id

app.post("/logout", (req, res) => {
  const user = { user: req.cookies.user_id};
  res.cookie('user', user);
  res.clearCookie('user');
  res.redirect("/urls");
});

// create new URL

app.get("/urls/new", (req, res) => {
  const templateVars = { user: req.cookies.user_id };
  res.render("urls_new", templateVars);
})

// shortURL routing and functionality
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], user: req.cookies.user_id };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.post("/urls", (req, res) => {
  const shortURL = genRandom();
  const longURL = req.body.longURL;
  urlDatabase[shortURL] = longURL;
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
  res.status(404)
  res.send("FOUR ZERO FOUR")
});

app.listen(PORT, () => {
  console.log(`TinyApp listening on port ${PORT}!`);
});
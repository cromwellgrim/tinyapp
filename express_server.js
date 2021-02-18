const express = require('express');
const app = express();
const PORT = 8080; 
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const { genRandom } = require('./genRandom.js');
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

const currentUser = {
  id: "randomID",
  email: "email",
  password: "password"
}

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


app.get("/urls.json", (req, res) => {
  console.log(users[id]);
  res.json(urlDatabase);
});

app.get("/", (req, res) => {
  const templateVars = { urls: urlDatabase, user: req.cookies["user"] };
  res.render("urls_index", templateVars);
});

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase, user: req.cookies["user"] };
  res.render("urls_index", templateVars);
});

app.get("/urls/register", (req, res) => {
  const templateVars = { user: req.cookies["user"] };
  res.render("urls_register", templateVars);
});

app.get("/urls/new", (req, res) => {
  const templateVars = { user: req.cookies["user"]};
  res.render("urls_new", templateVars);
});

app.get("/urls/show", (req, res) => {
  const templateVars = { user: req.cookies["user"]};
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], user: req.cookies["user"] };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
})

app.get("/urls/register", (req, res) => {
  const templateVars = { user: req.cookies["user"] };
  res.render("urls_register", templateVars);
})

// this is for generating shortURLs
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

// app.post("/urls/:shortURL", (req, res) => {
//   const templateVars = { user: req.cookies["user"] };
//   res.render("urls_new", templateVars);
// })

app.post("/urls/:id/edit", (req, res) => {
  const longURL = req.body.longURL;
  const shortURL = req.body.shortURL;
  urlDatabase[shortURL] = longURL;
  res.redirect("/urls");
});

app.post("/login", (req, res) => {
  const user = req.body.user; 
  res.cookie('user', user);
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  const user = req.body.user;
  res.cookie('user', user);
  res.clearCookie('user');
  res.redirect("/urls");
})

app.post("/urls/show", (req, res) => {
  const templateVars = { user: req.cookies["user"] };
  res.send("urls_show", templateVars)
});

app.post("/urls/new", (req, res) => {
  const templateVars = { user: req.cookies["user"] };
  res.send("urls_new", templateVars);
});

app.post("/urls/register", (req, res) => {
  const id = genRandom()
  users[id] = { id: id,
    email: req.body.email,
    password: req.body.password
  };
  console.log(users[id])
  res.cookie('user', users[id]);
  res.redirect("/urls");
});

app.post("*", (req, res) => {
  res.status(404).send(body);
  res.render("FOUR ZERO FOUR")
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
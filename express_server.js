const express = require('express');
const app = express();
const PORT = 8080; 
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

const generateRandomString = function() {
  /* create random character (Math.random) send it to a string (toString) don't want 0s (replace)
  and limit to 6 characters until string.length = 6 (substr) used 2 methods found online and combined!
  https://dev.to/oyetoket/fastest-way-to-generate-random-strings-in-javascript-2k5a
  */
    return Math.random().toString(36).replace('0.', '').substr(2, 6);
};

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};


app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/", (req, res) => {
  const templateVars = { urls: urlDatabase, username: req.cookies["username"] };
  res.render("urls_index", templateVars);
});


app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase, username: req.cookies["username"] };
  res.render("urls_index", templateVars);
});

app.get("/urls/register", (req, res) => {
  const templateVars = { username: req.cookies["username"] };
  res.render("urls_register", templateVars);
});

app.get("/urls/new", (req, res) => {
  const templateVars = { username: req.cookies["username"]};
  res.render("urls_new", templateVars);
});

app.get("/urls/show", (req, res) => {
  const templateVars = { username: req.cookies["username"]};
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], username: req.cookies["username"] };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
})

app.get("/urls/register", (req, res) => {
  const templateVars = { username: req.cookies["username"] };
  res.render("urls_register", templateVars);
})

app.post("/", (req, res) => {
  const templateVars = { username: req.cookies["username"] };
  res.send("urls_new", templateVars);
})

app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  const longURL = req.body.longURL;
  urlDatabase[shortURL] = longURL;
  res.redirect(`/urls/${shortURL}`);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect("/urls");
});

app.post("/urls/:shortURL", (req, res) => {
  const templateVars = { username: req.cookies["username"] };
  res.send("urls_new", templateVars);
})

app.post("/urls/:id/edit", (req, res) => {
  const longURL = req.body.longURL;
  const shortURL = req.body.shortURL;
  urlDatabase[shortURL] = longURL;
  res.redirect("/urls");
});

app.post("/login", (req, res) => {
  const username = req.body.username; 
  res.cookie('username', username);
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  const username = req.body.username;
  res.cookie('username', username)
  res.clearCookie('username')
  res.redirect("/urls");
})

app.post("/urls/show", (req, res) => {
  const templateVars = { username: req.cookies["username"] };
  res.send("/urls/show", templateVars)
});

app.post("/urls/new", (req, res) => {
  const templateVars = { username: req.cookies["username"] };
  res.send("urls_new", templateVars);
});

app.post("/urls/register", (req, res) => {
  const templateVars = { username: req.cookies["username"] };
  res.send("urls_register", templateVars);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
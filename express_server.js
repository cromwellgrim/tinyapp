const express = require('express');
const app = express();
const PORT = 8080; 
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

const generateRandomString = function() {
  /* create random character (Math.random) send it to a string (toString) don't want 0s (replace)
  and limit to 6 characters until string.length = 6 (substr) used 2 methods found online and combined!
  https://dev.to/oyetoket/fastest-way-to-generate-random-strings-in-javascript-2k5a
  */
    return Math.random().toString(36).replace('0.', '').substr(2, 6);
}

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/hellos", (req, res) => {
  const templateVars = { greeting: 'Hello World' };
  res.render("hello_world", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: req.params.longURL };
  res.render("urls_show", templateVars);
});

app.post("/urls", (req, res) => {
  console.log(req.body);
  res.send("Ok");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
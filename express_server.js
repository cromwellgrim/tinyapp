const express = require("express");
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const bcrypt = require("bcrypt");
const { genRandom, emailLookup, urlsOfUser } = require("./helperFunctions");

app.use(
	cookieSession({
		name: "session",
		keys: ["key1", "key2"],
	}),
);
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

//---------------------------
// GLOBAL VARIABLES
//---------------------------

/* these users are used for testing purposes */
const users = {
	userOne: {
		id: "userRandomID",
		email: "user@example.com",
		// super secret password: asdf
		password: "$2b$10$1jSz1rBL8w.zvZzkGjljieCVzSqoyDm1zAOE3Vwj1bGxIJlAF5Gg6",
	},
	userTwo: {
		id: "user2RandomID",
		email: "user2@example.com",
		password: "example2",
	},
};

/* test urls for initial test users */
let urlDatabase = {
	b2xVn2: { longURL: "http://www.lighthouselabs.ca", userID: "userRandomID" },
	"9sm5xK": { longURL: "http://www.google.ca", userID: "userRandomID" },
};

//---------------------------
// HOME PAGE
//---------------------------

/* redirect to urls or login (if not logged in) */
app.get("/", (req, res) => {
	if (req.session.userID){
	res.redirect("/urls");
	} else {
		res.redirect("/login");
	}
});

/* if user is not logged in go to login, otherwise show their database */
app.get("/urls", (req, res) => {
	if (req.session.userID === undefined) {
		res.status(400).send("Please go to /login");
	} else {
		const activeUser = req.session.userID;
		const urlsToDisplay = urlsOfUser(urlDatabase, activeUser.id);
		const templateVars = { urls: urlsToDisplay, user: req.session.userID };
		res.render("urls_index", templateVars);
	}
});

//---------------------------
// LOGIN GET AND POST
//---------------------------

/* if the user is not logged in, load login page, otherwise go to the index */
app.get("/login", (req, res) => {
	const activeUser = req.session.userID;
	if (!activeUser) {
		return res.render("login");
	}
	res.redirect("/urls");
});

/* if the user email matches and the password matches login the user in and give them their urlDatabase (if any) */
app.post("/login", (req, res) => {
	let activeUser = emailLookup(req.body.email, users);
	if (activeUser) {
		if (
			bcrypt.compareSync(req.body["password"], users[activeUser]["password"])
		) {
			req.session.userID = users[activeUser];
			urlsToDisplay = urlsOfUser(urlDatabase, req.session.userID.id);
			const templateVars = { urls: urlsToDisplay, user: req.session.userID };
			res.render("urls_index", templateVars);
		} else {
			return res.status(400).send("400 error, login issue");
		}
	} else {
		return res.status(400).send("400 error, login issue");
	}
});

//---------------------------
// REGISTER GET AND POST
//---------------------------

/* brings up the register page */
app.get("/register", (req, res) => {
	if (req.session.userID !== undefined) {
		res.redirect("/urls");
	} else {
	const activeUser = req.session.userID;
	const templateVars = { urls: urlDatabase, user: activeUser };
	res.render("register", templateVars);
	}
});

/* checks to see if an email is in use before registering user */
app.post("/register", (req, res) => {
	if (req.body.email === "" || req.body.password === "") {
		return res.status(400).send("400 error, please fill in all fields");
	}
	if (emailLookup(req.body.email, users)) {
		return res.status(400).send("400 error, email already in use");
	}
	if (!emailLookup(req.body.email, users)) {
		const id = genRandom();
		const hashedPass = bcrypt.hashSync(req.body.password, 10);
		users[id] = {
			id: id,
			email: req.body.email,
			password: hashedPass,
		};
		req.session.userID = users[id];
		return res.redirect("/urls");
	}
});

//---------------------------
// CREATE NEW TINYURL GET AND POST
//---------------------------

/* takes a user to the new tinyURL page */
app.get("/urls/new", (req, res) => {
	const templateVars = { urls: urlDatabase, user: req.session.userID };
	const activeUser = req.session.userID;
	if (activeUser === undefined) {
		return res.redirect("/login");
	}
	res.render("urls_new", templateVars);
});

/* creates a new shortURL and adds to urlDatabase */
app.post("/urls/", (req, res) => {
	if (req.session.userID) {
		const shortURL = genRandom();
		const longURL = req.body.longURL;
		urlDatabase[shortURL] = {
			longURL: longURL,
			userID: req.session.userID["id"],
		};
		res.redirect(`/urls/${shortURL}`);
	} else {
		res.status("400").send("Please go to /login")
	}
});

//---------------------------
// shortURL ROUTING
//---------------------------

/* follow your shortURL link to the longURL site */
app.get("/u/:shortURL", (req, res) => {
	if(!urlDatabase[req.params.shortURL]){
		res.status(404).send("No shortURL made with this id yet");
	} else {
		const longURL = urlDatabase[req.params.shortURL]["longURL"];
		res.redirect(longURL);
	}
});

/* shows the page for a specific shortURL */
app.get("/urls/:shortURL", (req, res) => {
	if (req.session.userID) {
		urlsToDisplay = urlsOfUser(urlDatabase, req.session.userID.id);
		if (urlsToDisplay[req.params.shortURL] !== undefined) {
			const templateVars = {
				shortURL: req.params.shortURL,
				longURL: urlsToDisplay[req.params.shortURL]["longURL"],
				user: req.session.userID,
			};
			res.render("urls_show", templateVars);
		} else {
			res.status(404).send("this is not your shortURL page");
		}
	} else {
		res.status(400).send("please login")
	}
});

/* allows users to edit their shortURL */
app.get("/urls/:shortURL/edit", (req, res) => {
	if (req.session.userID) {
		urlsToDisplay = urlsOfUser(urlDatabase, req.session.userID.id);
		if (urlsToDisplay[req.params.shortURL] !== undefined) {
			const templateVars = {
				shortURL: req.params.shortURL,
				longURL: urlsToDisplay[req.params.shortURL]["longURL"],
				user: req.session.userID,
			};
			res.render("urls_show", templateVars);
		} else {
			res.status(404).send("this is not your shortURL page");
		}
	} else {
		res.status(400).send("please login")
	}
});

/* posts edit to main URLs page */
app.post("/urls/:shortURL/edit", (req, res) => {
	if (!req.session.userID) {
		res.status(400).send("Please go to /login");
	} else {
		urlsToDisplay = urlsOfUser(urlDatabase, req.session.userID.id);
		if (urlsToDisplay[req.params.shortURL] !== undefined) {
			const userID = req.session.userID.id;
			const shortURL = req.params.shortURL;
			const longURL = req.body.longURL;
			urlDatabase[shortURL] = { longURL: longURL, userID: userID };
			res.redirect("/urls");
		} else {
			res.status(400).send("Please only change your shortURL");
		}
	}
});

/* deletes shortURL from urlDatabase */
app.post("/urls/:shortURL/delete", (req, res) => {
	if(!req.session.userID) {
		res.status(400).send("Please go to /login");
	} else {
		urlsToDisplay = urlsOfUser(urlDatabase, req.session.userID.id);
		if (urlsToDisplay[req.params.shortURL] !== undefined) {
		const shortURL = req.params.shortURL;
		delete urlDatabase[shortURL];
		res.redirect("/urls");
		} else {
			res.status(400).send("Please don't delete someone else's shortURL")
		}
	}
});

//---------------------------
// LOGOUT AND CLEAR USER
//---------------------------

app.post("/logout", (req, res) => {
	req.session = null;
	res.redirect("/urls");
});

//---------------------------
// GENERAL 404 ERROR PAGE
//---------------------------

app.post("*", (req, res) => {
	res.status(404).send("FOUR ZERO FOUR");
});

app.listen(PORT, () => {
	console.log(`TinyApp listening on port ${PORT}!`);
});

const express = require("express");
const app = express();
const PORT = 8080; //Default por 8080
const cookieSession = require("cookie-session");
const bcrypt = require("bcryptjs");
const { getUserByEmail } = require("./helpers");


// Elements to be used in the code.
app.use(express.urlencoded({extended: true}));
app.use(cookieSession({
  name: 'session',
  keys: ['someSecretKey'],      // required for signing
  maxAge: 24 * 60 * 60 * 1000   // 24 hours cookie
}));
app.use((req, res, next) => {
  const user_id = req.session.user_id; // or from req.session.username
  res.locals.user_id = user_id || null;
  next();
});



// Template format that we will use
app.set("view engine", "ejs");


// Local Databases
const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "erjsfr",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW",
  },
};


const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};

// DRY Functions that will be used throghoug the code.

//Generate a random URL Id.
const generateRandomString = function() {
  return Math.random().toString(36).substring(2,8);
};

//Check if the id of user logged in owns a give URL

const requireLogin = function(req, res, next) {
  const userID = req.session.user_id;
  if (!userID) {
    return res.status(401).render("error", {
      errorMessage: "❗ You must be logged in."
    });
    
  }
  req.userID = userID;
  return next();
};

const checkUrlExists =  function(req, res, next) {
  const url = urlDatabase[req.params.id];
  if (!url) {

    return res.status(404).render("error", {
      errorMessage: `❗ No URL found with id: ${req.params.id}`
    });
    
  }
  req.urlObj = url;
  return next();


};

const urlsForUser = function(req, res, next) {
  

  if (req.urlObj.userID !== req.userID) {
    return res.status(403).render("error", {
      errorMessage: "❗ You don't have permission to modify this URL."
    });
  
  }


  return next();

   
};


// GET Methods to rended in .ejs files.

app.get("/", (req, res) => {
   if (!req.session.user_id) {
    return res.redirect("/login");
  }
  res.redirect("/urls");
});


app.get("/urls", (req, res) => {
  const templateVars = {urls: urlDatabase , users: req.session["id"]};
  res.render("urls_index", templateVars);
  
});

app.get("/urls/new", (req, res) => {

  if (!req.session.user_id) {
    return res.redirect("/login");
  }
  res.render("urls_new");
});

app.get("/register", (req, res) => {
  if (req.session.user_id) {
    res.redirect("/urls");
  }
  res.render("register");
});

app.get("/login", (req, res) => {

  if (req.session.user_id) {
    res.redirect("/urls");
  }
  res.render("login");
});


// POST Methods to action once user interacts with our app.

app.post("/register", (req, res) => {
  const user_id = generateRandomString();

  const email = req.body.email;
  const password = req.body.password;
  const hashedPassword = bcrypt.hashSync(password, 10);

  if (!email || !password) {
    return res.status(400).render("error", {
      errorMessage: "Please enter missing fields"
    });
   
  }
  
  const existingUser = getUserByEmail({email, users});
  
  if (existingUser !== null && existingUser.email === email) {
    return res.status(403).render("error", {
      errorMessage: "Account already exists"
    });

  }

  users[user_id] = {id: user_id, email, hashedPassword};
  req.session.user_id = user_id;
  res.redirect("/urls");

});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const existingUser = getUserByEmail({email,users});
  if (existingUser === null) {
    return res.redirect("/register");
  }

  const passwordMatches = bcrypt.compareSync(password, existingUser.hashedPassword);

  if (!passwordMatches) {
    return res.status(403).render("error", {
      errorMessage: "❌ Wrong password"
    });

  }

  req.session.user_id = existingUser.id;
  return res.redirect("/urls");
});

app.post("/logout" , (req, res) => {
  req.session = null;
  res.redirect("/login");

});


app.post("/urls", (req, res) => {

  if (!req.session.user_id) {
    return res.status(404).render("error", {
      errorMessage: "You need to log in to create a new URL."
    });
  }
  const randomID = generateRandomString();
  const userID = req.session.user_id;
  const longURL = req.body.longURL;
  urlDatabase[randomID] = {longURL , userID };

  res.redirect(`/urls/${randomID}`);
});



app.post("/urls/:id",
  requireLogin,
  checkUrlExists,
  urlsForUser,
  (req, res) => {
    urlDatabase[req.params.id].longURL = req.body.longURL;
    res.redirect("/urls");
  }
);

app.get("/u/:id", (req, res) => {

  const shortURL = req.params.id;


  const urlEntry = urlDatabase[shortURL];

  if (!urlEntry) {
 
    return res.status(404).render("error", {
      errorMessage: "Short URL not found."
    });
  }

  const longURL = urlEntry.longURL;

  if (!longURL) {
    return res.status(404).render("error", {
      errorMessage: "URL is missing."
    });
  }


  res.redirect(longURL);
});


app.post(
  "/urls/:id/delete",
  requireLogin,
  checkUrlExists,
  urlsForUser,
  (req, res) => {
  
    delete urlDatabase[req.params.id];
    res.redirect("/urls");
  }
);


app.get("/urls/:id", requireLogin, checkUrlExists, urlsForUser, (req, res) => {

  if (!req.session.user_id) {
    return res.status(404).render("error", {
      errorMessage: "You need to log in to see URL page"
    });
   
  }

  const id = req.params.id;
  const longURL = urlDatabase[id].longURL;
  const templateVars = {id, longURL};
  res.render("urls_show", templateVars);
});


//Conenction to the server

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});


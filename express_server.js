const express = require("express");
const app = express();
const PORT = 8080; //Default por 8080
const cookieParser = require("cookie-parser");


// Elements to be used in the code. 
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use((req, res, next) => {
  const user_id = req.cookies.user_id; // or from req.session.username
  res.locals.user_id = user_id || null;
  next();
});


// Template format that we will use
app.set("view engine", "ejs");


// DRY Functions that will be used throghoug the code. 

const generateRandomString = function () {
  return Math.random().toString(36).substring(2,8);
}

const userLookup = function(existingEmail){
  const foundUser = Object.values(users).find(
    user => user.email === existingEmail
  );

  if (foundUser) {
    return foundUser;  // If found the user based  on the email, return the entire information object of that user
  }

  return null; // or return undefined
};


// Local Databases
const urlDatabase = {
  b2xVn2:"http://www.lighthouselabs.ca",
  "9sm5xK":"http://www.google.com"
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

// GET Methods to rended in .ejs files.
app.get("/urls", (req, res) => {
  const templateVars = {urls: urlDatabase , users: req.cookies["id"]};
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {

  if(!req.cookies.user_id){
    return res.redirect("/login")
  }
  res.render("urls_new");
});

app.get("/register", (req, res) => {
   if(req.cookies.user_id){
    res.redirect("/urls")
  }
  res.render("register");
});

app.get("/login", (req, res) => {

  if(req.cookies.user_id){
    res.redirect("/urls")
  }
  res.render("login");
})


// POST Methods to action once user interacts with our app.

app.post("/register", (req, res) => {
  const user_id = generateRandomString();

  const email = req.body.email
  const password = req.body.password

  if (!email || !password) {
    return res.status(400).send("Please enter the missing fields");
  }
  
  const existingUser = userLookup(email)
  console.log(existingUser)
  if(existingUser !== null && existingUser.email === email) {
    return res.status(400).send("Account already exists");
  }

  users[user_id] = {id: user_id, email, password}
  res.cookie("user_id", user_id, { path: "/"})
  console.log(users)

 
  res.redirect("/urls");

});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password

  const existingUser = userLookup(email)
  if (existingUser === null){
    return res.redirect("/register");
  } 

  if (existingUser.email === email && existingUser.password !== password) {
    return res.status(403).send("Wrong Password");
  }

  res.cookie("user_id", existingUser.id, { path: "/"});
  return res.redirect("/urls")
});

app.post("/logout" , (req, res) => {
  res.clearCookie('user_id', { path: '/'}).redirect("/login");
});


app.post("/urls", (req, res) => {

  if(!req.cookies.user_id){
    return res.status(404).send("You need to log in to create a new URL");
  }
  const randomID = generateRandomString();
  const longURL = req.body.longURL;
  urlDatabase[randomID] = longURL;
  res.redirect(`/urls/${randomID}`);
});

app.post("/urls/:id/delete", (req,res) => {
  const deleteID = req.params.id;
  delete urlDatabase[deleteID];
  res.redirect("/urls");

});

app.post("/urls/:id", (req, res) => {


  const newURL = req.body.longURL;
  const id = req.params.id;
  urlDatabase[id] = newURL;
  res.redirect("/urls");
});

app.get("/u/:id", (req, res) => {

  
  const id = req.params.id;
  const longURL = urlDatabase[id];
  if (!longURL) {
    return res.status(404).send("URL not found");
  }
  res.redirect(longURL);
});


app.get("/urls/:id", (req, res) => {
  const id = req.params.id;
  const longURL = urlDatabase[id];
  const templateVars = {id , longURL};
  res.render("urls_show", templateVars);
});


//Conenction to the server

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});


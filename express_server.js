const express = require("express");
const app = express();
const PORT = 8080; //Default por 8080
const cookieParser = require("cookie-parser");

app.use(express.urlencoded({extended: true}));
app.use(cookieParser());



app.set("view engine", "ejs");

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



app.use((req, res, next) => {
  const email = req.cookies.email; // or from req.session.username
  res.locals.email = email || null;
  next();
});

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




app.get("/urls", (req, res) => {
  const templateVars = {urls: urlDatabase , users: req.cookies["email"]};
  res.render("urls_index", templateVars);
});



app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/register", (req, res) => {
  res.render("register");
});




app.post("/logout" , (req, res) => {
  res.clearCookie('email', { path: '/'}).redirect("/urls");
});

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
  res.cookie("email", email, { path: "/"})
  console.log(users)

 
  res.redirect("/urls");

});

app.post("/login", (req, res) => {
  const email = req.body.email;

  const existingUser = userLookup(email)
  if (existingUser === null){
    return res.redirect("/register");
  } 

  res.cookie("email", email, { path: "/"});
  return res.redirect("/urls")
});



app.post("/urls", (req, res) => {
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

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});


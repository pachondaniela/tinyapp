const express = require("express");
const app = express();
const PORT = 8080; //Default por 8080

app.use(express.urlencoded({extended: true}))


app.set("view engine", "ejs");

function generateRandomString() {
  return Math.random().toString(36).substring(2,8);
}

const urlDatabase = {
   b2xVn2:"http://www.lighthouselabs.ca",
  "9sm5xK":"http://www.google.com"
};

app.get("/urls", (req, res) => {
  const templateVars = {urls: urlDatabase}
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.post("/urls", (req, res) => {
  const randomID = generateRandomString()
  const longURL = req.body.longURL
  urlDatabase[randomID] = longURL
  res.redirect(`/urls/:${randomID}`)
})

app.get("/u/:id", (req, res) => {
  const id = req.params.id
  const longURL = urlDatabase[id]
    if (!longURL) {
    return res.status(404).send("URL not found");
  }
  res.redirect(longURL)
})


app.get("/urls/:id", (req, res) => {
  const id = req.params.id
  const longURL = urlDatabase[id]
  const templateVars = {id , longURL}
  res.render("urls_show", templateVars);
});





app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});


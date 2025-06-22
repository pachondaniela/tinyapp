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

const userLookup = function(existingEmail){
  const foundUser = Object.values(users).find(
    user => user.email === existingEmail
  );

  if (foundUser) {
    return foundUser;  // If found the user based  on the email, return the entire information object of that user
  }

  return null; // or return undefined
};


module.exports = {
  userLookup
}


const userLookup = function(users, existingEmail){
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
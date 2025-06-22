
const userLookup = function({ email, users }) {
  const foundUser = Object.values(users).find(user => user.email === email);
  return foundUser || null;
};

module.exports = {
  userLookup
}
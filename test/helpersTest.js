const { assert } = require('chai');

const { userLookup } = require('../helpers.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

describe('userLookup', function() {
  it('should return a user with valid email', function() {
    const user = userLookup("user@example.com", testUsers);
    const expectedUserID = "userRandomID";
    assert.equal(user.email, testUsers[expectedUserID].email, 'should return correct user id');
  });

  it('should return null for non-existent email', function() {
    const user = userLookup("notfound@example.com", testUsers);
    assert.isNull(user, 'should return null for invalid email');
  });
});

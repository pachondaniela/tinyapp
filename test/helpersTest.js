const { assert } = require('chai');

const { getUserByEmail } = require('../helpers.js');

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

describe('getUserByEmail', function() {
  it('Email entered exists ', function() {
    const user = getUserByEmail({email: "user@example.com", users: testUsers});
    const expectedUserID = "user@example.com";
    
    assert.equal(user.email, expectedUserID );
   
  });

  it('should return undefined for non-existent email', function() {
    const user = getUserByEmail({email:"notfound@example.com", users: testUsers});
    assert.equal(user, undefined);
  });


});

const emailLookup = function(email, users) {
  for (let each in users) {
    if(email === users[each].email) {
      return 'this email is already in use';
    }
  }
  return 'good to go'
};

module.exports = { emailLookup };




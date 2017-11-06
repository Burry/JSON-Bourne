const models = require('./models');
const User = models.User;

User.create({
    userID: 0,
    firstName: 'Jon',
    lastName: 'Doe'
});

module.exports = {};

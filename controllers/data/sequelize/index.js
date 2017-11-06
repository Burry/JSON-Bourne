const models = require('./models');
const User = models.User;

User.create({
    UserID: 0,
    FirstName: 'Jon',
    LastName: 'Doe'
});

module.exports = {};

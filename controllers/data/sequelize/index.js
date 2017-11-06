const models = require('./models');
const User = models.User;

User.create({
    FirstName: 'Jon',
    LastName: 'Doe'
});

module.exports = {};

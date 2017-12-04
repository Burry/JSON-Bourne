const expect = require('chai').expect;
const sql = require('../models').sql;
const User = sql.User;

const sync = sql.sequelize.sync({ force: true, logging: false });

describe('Sequelize Models', () => {
    before(() => sync);

    after(() => sync);

    describe('User.create()', () => {
        it('should save new user to database', () => {
            let user = {
                firstName: 'Jon',
                lastName: 'Doe',
                email: 'jondoe@findmyappetite.com',
                password: 'hunter2',
                resetPasswordKey: 'youllneverguessthis'
            };
            return User.create(user);
        });
    });
});

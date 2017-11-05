require('dotenv').config();
const Sequelize = require('sequelize');
const sequelize = new Sequelize('findmyappetite', process.env.PGUSER, process.env.PGPASS, {
    host: 'localhost',
    dialect: 'postgres',

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },

    // Add directive to connect to Postgres

    // http://docs.sequelizejs.com/manual/tutorial/querying.html#operators
    operatorsAliases: false
});

sequelize.sync();

module.exports = {};

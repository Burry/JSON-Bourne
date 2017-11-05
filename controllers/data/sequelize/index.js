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
    }
});

// sequelize.sync();

sequelize.authenticate().then(() => {
  console.log("Success!");
}).catch((err) => {
  console.log(err);
});

module.exports = {};

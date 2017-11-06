'use strict';

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(module.filename);
const config = {
    username: process.env.PGUSER || 'root',
    password: process.env.PGPASS || null,
    database: 'findmyappetite',
    host: '127.0.0.1',
    dialect: 'postgres'
};
const db = {};

// Connect to PostgreSQL
const sequelize = new Sequelize(config.database, config.username, config.password, config);

// Import models
fs.readdirSync(__dirname)
    .filter(file =>
        (file.indexOf('.') !== 0) &&
        (file !== basename) &&
        (file.slice(-3) === '.js'))
    .forEach(file => {
        const model = sequelize.import(path.join(__dirname, file));
        db[model.name] = model;
    });

// Add associations to model objects
Object.keys(db).forEach(modelName => {
    if (db[modelName].associate)
        db[modelName].associate(db);
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Sequelize debugging
// const models = require('./models');
// const sql = models.sql;
// sql.User.create({
//     firstName: 'Jon',
//     lastName: 'Doe',
//     email: 'jondoe@gmail.com',
//     password: 'hunter2'
// }).then(() => {
//     return sql.User.findAll();
// }).then(users => {
//     console.log('Users: ', users);
// });

module.exports = db;

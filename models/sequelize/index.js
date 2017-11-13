'use strict';

const importModels = require('../import');
const path = require('path');
// const populateTestData = require('./test-data');
const sequelize = require('sequelize');
const config = {
    username: process.env.PGUSER || 'root',
    password: process.env.PGPASS || null,
    database: 'findmyappetite',
    host: '127.0.0.1',
    dialect: 'postgres'
};

// Connect to PostgreSQL
const db = {
    Sequelize: sequelize,
    sequelize: new sequelize(config.database, config.username, config.password, config)
};

// Import models
importModels(__dirname, model => new Promise(resolve => {
    db[model] = db.sequelize.import(path.join(__dirname, model));
    resolve();
})).then(() => {
    // Add associations to model objects
    Object.keys(db).forEach(model => {
        if (db[model].associate)
            db[model].associate(db);
    });
});

// Utility to delete database
db.drop = next => {
    let dropPromises = [];
    Object.keys(db).forEach(model => {
        if (/^[A-Z](?!.*equelize).*$/.test(model))
            dropPromises.push(db[model].destroy({where: {}}));
    });
    Promise.all(dropPromises)
        .then(() => {
            next();
            db.sequelize.close();
        })
        .catch(err => {
            console.error(err);
            throw err;
        });
};

module.exports = db;

'use strict';

require('dotenv').config();
const importModels = require('../import');
const mongoose = require('mongoose');
const populateTestData = require('./test-data');
const db = {};

// Use native promises
mongoose.Promise = global.Promise;

// Connect to MongoDB
mongoose.connect('mongodb://localhost/findmyappetite', {useMongoClient: true});

db.connection = mongoose.connection;
db.close = mongoose.connection.close;
db.exec = mongoose.connection.db;

// Error logging
db.connection.on('error', console.error.bind('Mongoose error: ', console));

// Import models
db.connection.on('open', () => {
    importModels(__dirname, model => new Promise(resolve => {
        db[model] = require('./' + model);
        resolve();
    }));
});

// Utility to close database connection
db.close = next => db.connection.close(next && next);

// Utility to delete database
db.drop = next => db.connection.on('open', () => db.connection.db.dropDatabase(() => db.close(next)));

// Utility to populate test data
db.populateTestData = next => db.connection.on('open', () => populateTestData(db, next));

module.exports = db;

'use strict';

require('dotenv').config();
const importModels = require('../import');
const importScraper = require('./recipe-ingredient-importer');
const mongoose = require('mongoose');
const dbURL = 'mongodb://' + (process.env.MONGOURL || 'localhost/findmyappetite');
const db = {};

// Use native promises
mongoose.Promise = global.Promise;

// Connect to MongoDB
mongoose.connect(dbURL, {useMongoClient: true});

db.connection = mongoose.connection;
db.close = mongoose.connection.close;
db.exec = mongoose.connection.db;

// Error logging
db.connection.on('error', console.error.bind('Mongoose error: ', console));

// Import models
importModels(__dirname, model => new Promise(resolve => {
    db[model] = require('./' + model);
    resolve();
}));

// Utility to close database connection
db.close = next => db.connection.close(next && next);

// Utility to delete database
db.drop = next => db.connection.on('open', () => db.connection.db.dropDatabase(next && next));

db.dropAndClose = next => db.drop(db.close(next));

// Utility to call scraper and populate Ingredient and Recipe collections
db.populate = next => importScraper(db, next);

module.exports = db;

'use strict';

require('dotenv').config();
const importModels = require('../import');
const importScraper = require('./recipe-ingredient-importer');
const mongoose = require('mongoose');
const db = {};

let dbURL = 'mongodb://' + (process.env.MONGOURL || 'localhost/findmyappetite');

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

// Utility to delete database
db.drop = next => mongoose.connection.on('open', () => mongoose.connection.db.dropDatabase(next && next));

db.dropAndClose = next => db.drop(mongoose.connection.close(next));

// Utility to call scraper and populate Ingredient and Recipe collections
db.populate = next => importScraper(db, next);

module.exports = db;

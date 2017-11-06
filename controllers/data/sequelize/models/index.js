'use strict';

require('dotenv').config()
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(module.filename);
const config = {
    'username': process.env.PGUSER,
    'password': null,
    'database': 'findmyappetite',
    'host': '127.0.0.1',
    'dialect': 'postgres'
};
const db = {};

let sequelize = new Sequelize('findmyappetite', process.env.PGUSER, process.env.PGPASS, config);

fs
  .readdirSync(__dirname)
  .filter(file =>
    (file.indexOf('.') !== 0) &&
    (file !== basename) &&
    (file.slice(-3) === '.js'))
  .forEach(file => {
    const model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

console.log(db);

module.exports = db;

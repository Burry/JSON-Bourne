const mongoose = require('./mongoose');
const sequelize = require('./sequelize');

module.exports = {
    mongo: mongoose,
    sql: sequelize
};

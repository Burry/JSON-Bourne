const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/findmyappetite');
const mongo = mongoose.connection;

mongo.on('error', console.error.bind(console, 'Mongoose error:'));

mongo.once('open', function() {
    // Connected to mongo database
});

module.exports = {};

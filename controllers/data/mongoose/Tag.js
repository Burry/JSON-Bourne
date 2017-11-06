const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let schema = new Schema({
    name: String,
    type: String // health, diet, preference
});

module.exports = mongoose.model('Tag', schema);

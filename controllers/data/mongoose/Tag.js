const Model = require('mongoose').Model;
const Schema = require('mongoose').Schema;

let schema = new Schema({
    name: String,
    type: String // health, diet, preference
});

module.exports = Model('Tag', schema);

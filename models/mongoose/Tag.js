const mongoose = require('mongoose');
const findOrCreate = require('mongoose-find-or-create');
const Schema = mongoose.Schema;

let schema = new Schema({
    name: String,
    type: String // health, diet, preference
});

schema.plugin(findOrCreate);

module.exports = mongoose.model('Tag', schema);

const mongoose = require('mongoose');
const findOrCreate = require('mongoose-find-or-create');
const Schema = mongoose.Schema;

let schema = new Schema({
    name: String,
    origURL: String,
    steps: [String],
    time: { // time in minutes
        prep: Number,
        cook: Number
    },
    author: String, // Sequelize user primary key
    likes: Number,
    created: Date,
    ingredients: [{
        type: Schema.ObjectId,
        ref: 'Ingredient'
    }],
    tags: [{
        type: Schema.ObjectId,
        ref: 'Tag'
    }]
});

schema.plugin(findOrCreate);

module.exports = mongoose.model('Recipe', schema);

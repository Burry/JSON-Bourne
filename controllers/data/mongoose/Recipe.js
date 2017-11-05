const Model = require('mongoose').Model;
const Schema = require('mongoose').Schema;

let schema = new Schema({
    name: String,
    origURL: String,
    steps: [String],
    time: { // time in minutes
        prep: Number,
        cook: Number
    },
    author: String, // Sequelize user key
    likes: Number,
    created: Date,
    ingredients: [{
        type : Schema.ObjectId,
        ref: 'Ingredient'
    }],
    tags: [{
        type : Schema.ObjectId,
        ref: 'Tag'
    }]
});

module.exports = Model('Recipe', schema);

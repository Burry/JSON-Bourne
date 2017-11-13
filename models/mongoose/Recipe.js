const mongoose = require('mongoose');
const findOrCreate = require('mongoose-find-or-create');
const Schema = mongoose.Schema;
const shortid = require('shortid');

let schema = new Schema({
    _id: {
        type: String,
        default: shortid.generate
    },
    name: String,
    type: String,
    origURL: String,
    steps: [String],
    time: Number, //in minutes
    servings: String, //in servings
    author: String, // Sequelize user primary key
    likes: Number,
    photoURL: String,
    created: Date,
    ingredients: [{
        type: Schema.ObjectId,
        ref: 'Ingredients'
    }],
    tags: [{
        type: Schema.ObjectId,
        ref: 'Tag'
    }],
    nutrition: {
        calTotal: Number,
        calFromFat: Number,
        totalFat: Number, //in grams
        saturatedFat: Number, //in grams
        cholesterol: Number, // in mg
        sodium: Number, // in mg
        carbs: Number, // in grams
        fiber: Number, // in grams
        sugars: Number, // in grams
        protein: Number, // in grams
        calcium: Number // in mg
    }
});

schema.plugin(findOrCreate);

module.exports = mongoose.model('Recipe', schema);

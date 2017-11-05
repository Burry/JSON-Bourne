const Model = require('mongoose').Model;
const Schema = require('mongoose').Schema;

let schema = new Schema({
    name: String,
    avgPrice: Number, // price in USD
    nutrition: {
        calories: {
            total: Number,
            fromFat: Number
        },
        fat: { // in grams
            total: Number,
            saturated: Number,
            trans: Number
        },
        cholesterol: Number, // in mg
        sodium: Number, // in mg
        carbs: Number, // in grams
        fiber: Number, // in grams
        sugars: Number, // in grams
        protein: Number, // in grams
        calcium: Number // in mg
    }
});

module.exports = Model('Recipe', schema);

const mongoose = require('mongoose');
const findOrCreate = require('mongoose-find-or-create');
const Schema = mongoose.Schema;

let schema = new Schema({
    name: String,
    avgPrice: Number, // price in USD
    tags: [{
        type : Schema.ObjectId,
        ref: 'Tag'
    }],
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

schema.plugin(findOrCreate);

module.exports = mongoose.model('Ingredient', schema);

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
        calTotal: Number,
        calFromFat: Number
        totalFat: Number,//in grams
        saturatedFat: Number,//in grams
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

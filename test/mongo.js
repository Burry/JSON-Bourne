'use strict';

require('dotenv').config();
const expect = require('chai').expect;
const Camo = require('camo');
const mongo = require('../models').mongo;
const Ingredient = mongo.Ingredient;
const Recipe = mongo.Recipe;
const Tag = mongo.Tag;
const dbURL = 'mongodb://' + (process.env.MONGOURL || 'localhost/findmyappetite');

describe('Mongo Models', () => {
    let database = null;

    before(done => {
        Camo.connect(dbURL).then(db => {
            database = db;
            return database.dropDatabase();
        }).then(() => {}).then(done, done);
    });

    afterEach(done => {
        database.dropDatabase().then(function() {}).then(done, done);
    });

    describe('Ingredient.save()', () => {
        it('should save Ingredient data to database', done => {
            let ingredient = new Ingredient({
                _id: 'TEST_INGREDIENT_0',
                name: 'Test ingredient',
                type: 'ingredient',
                // tags: [{
                //     type : Schema.ObjectId,
                //     ref: 'Tag'
                // }],
                nutrition: {
                    calTotal: 500,
                    calFromFat: 100,
                    totalFat: 15, //in grams
                    saturatedFat: 0, //in grams
                    cholesterol: 50, // in mg
                    sodium: 800, // in mg
                    carbs: 25, // in grams
                    fiber: 5, // in grams
                    sugars: 15, // in grams
                    protein: 25, // in grams
                    calcium: 150 // in mg
                }
            });

            ingredient.save(err => {
                if (err) throw err;
                else done();
            });
        });
    });

    describe('Ingredient.findOne()', () => {
        it('should load Ingredient data from database', done => {
            Ingredient.findOne({_id: 'TEST_INGREDIENT_0'}, (err, ingredient) => {
                if (err) throw err;
                else done();
            });
        });
    });
});

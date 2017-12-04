require('dotenv').config();
const expect = require('chai').expect;
const Camo = require('camo');
const mongo = require('../models').mongo;
const Ingredient = mongo.Ingredient;
const Recipe = mongo.Recipe;
const Tag = mongo.Tag;
const dbURL = 'mongodb://' + (process.env.MONGOURL || 'localhost/findmyappetite');

describe('Mongoose Models', () => {
    let db = null;
    let nutrition = {
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
    };
    let newTagID = null;

    before(done => {
        Camo.connect(dbURL)
            .then(db => db.dropDatabase())
            .then(mongo.connection.on('open', done));
    });

    after(done => mongo.dropAndClose(done));

    describe('Tag.save()', () => {
        it('should save new tag to database', done => {
            let tag = new Tag({
                name: 'Test Tag',
                type: 'health'
            });
            tag.save((err, tag) => {
               if (err) done(err);
               else {
                   newTagID = tag._id;
                   done();
               }
            });
        });
    });

    describe('Ingredient.save()', () => {
        it('should save new ingredient with new tag to database', done => {
            let ingredient = new Ingredient({
                _id: 'TEST_INGREDIENT_0',
                name: 'Test Ingredient',
                type: 'ingredient',
                tags: [newTagID],
                nutrition: nutrition,
                test: true
            });
            ingredient.save(done);
        });
    });

    describe('Recipe.save()', () => {
        it('should save new recipe with new ingredient and tag to database', done => {
            let recipe = new Recipe({
                uuid: '1234ABCD',
                name: 'Test Recipe',
                type: 'recipe',
                origURL: 'https://findmyappetite.com',
                steps: ['Step 1', 'Step 2', 'Step 3'],
                time: 30, //in minutes
                servings: 2,
                author: 'Anonymous',
                likes: 0,
                photoURL: 'https://findmyappetite.com',
                // ingredients: ['TEST_INGREDIENT_0', 'TEST_INGREDIENT_0'],
                tags: [newTagID],
                nutrition: nutrition,
                test: true
            });
            recipe.save(done);
        });
    });

    describe('Tag.findOne()', () => {
        it('should load new tag from database', done => {
            Tag.findOne({_id: newTagID}, done);
        });
    });

    describe('Ingredient.findOne()', () => {
        it('should load new ingredient from database', done => {
            Ingredient.findOne({_id: 'TEST_INGREDIENT_0'}, done);
        });
    });

    describe('Recipe.findOne()', () => {
        it('should load new recipe from database', done => {
            Recipe.findOne({name: 'Test Recipe'}, done);
        });
    });
});

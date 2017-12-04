'use strict';

require('dotenv').config();
process.env.NODE_ENV = 'test';

const Camo = require('camo');
const chai = require('chai');
const expect = chai.expect;
const mongo = require('../models').mongo;
const ObjectId = require('mongoose').Types.ObjectId;
const Ingredient = mongo.Ingredient;
const Recipe = mongo.Recipe;
const Tag = mongo.Tag;

const dbURL = 'mongodb://' + (process.env.MONGOURL || 'localhost/findmyappetite') + '_test';

describe('Mongoose Models', () => {
    const nutrition = {
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
    const tag = new Tag({
        name: 'Test Tag',
        type: 'health'
    });
    const ingredient = new Ingredient({
        _id: ObjectId(),
        name: 'Test Ingredient',
        type: 'ingredient',
        tags: [],
        nutrition: nutrition
    });
    const recipe = new Recipe({
        uuid: 'TEST1234',
        name: 'Test Recipe',
        type: 'recipe',
        origURL: 'https://findmyappetite.com',
        steps: ['Step 1', 'Step 2', 'Step 3'],
        time: 30,
        servings: 2,
        author: 'Anonymous',
        likes: 0,
        photoURL: 'http://via.placeholder.com/500x500',
        ingredients: [],
        tags: [],
        nutrition: nutrition
    });

    beforeEach(() =>
        Camo.connect(dbURL)
            .then(db => db.dropDatabase())
    );

    after(done => mongo.dropAndClose(done));

    describe('Tag.save()', () => {
        it('should save new tag to database', () => {
            return tag.save();
        });
    });

    describe('Ingredient.save()', () => {
        it('should save new ingredient to database', () => {
            return ingredient.save();
        });
    });

    describe('Recipe.save()', () => {
        it('should save new recipe to database', () => {
            return recipe.save();
        });
    });

    describe('Tag.findOne()', () => {
        it('should load new tag from database', () => {
            return tag.save()
                .then(newTag => Tag.findById(newTag._id));
        });
    });

    describe('Ingredient.findOne()', () => {
        it('should load new ingredient from database', () => {
            return ingredient.save()
                .then(newIngredient => Ingredient.findById(newIngredient._id));
        });
    });

    describe('Recipe.findOne()', () => {
        it('should load new recipe from database', () => {
            return recipe.save()
                .then(newRecipe => Recipe.findById(newRecipe._id));
        });
    });
});

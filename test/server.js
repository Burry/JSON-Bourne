'use strict';

process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const mongo = require('../models').mongo;
const Recipe = mongo.Recipe;
const server = require('../app.js');

const testExpectOkHtml = path =>
    it(`GET ${path} returns 200 and HTML`, () => {
        chai.request(server).get(path)
            .then(res => {
                expect(res).to.have.status(200);
                expect(res).to.be.html;
            })
            .catch(err => {
                throw new Error(err);
            });
    });

const throwError = (err, msg) => {
    if (msg)
        throw new Error(msg);
    else throw new Error(err);
};

chai.use(chaiHttp);

// Cannot use arrow function since they don't bind "this" object
describe('Express Server', function() {
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

    this.timeout(1000);

    testExpectOkHtml('/');
    testExpectOkHtml('/design');
    testExpectOkHtml('/discover');
    testExpectOkHtml('/favorites');
    testExpectOkHtml('/pantry');

    it(`GET /recipe/[new test recipe] returns 200 and HTML`, () => {
        return recipe.save()
            .then(newRecipe => chai.request(server).get(`/recipe/${newRecipe.uuid}`))
            .then(res => {
                expect(res).to.have.status(200);
                expect(res).to.be.html;
            })
            .catch(err => {
                throw new Error(err);
            });
    });

    it('GET /NOT_A_RESOURCE returns 404', () => {
        return chai.request(server)
            .get('/NOT_A_RESOURCE')
            .then(res => {
                throw new Error('Path /NOT_A_RESOURCE exists!');
            })
            .catch(err => {
                expect(err).to.have.status(404);
            });
    });
});

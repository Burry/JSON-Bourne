'use strict';

process.env.NODE_ENV = 'test';

const Camo = require('camo');
const chai = require('chai');
const chaiHttp = require('chai-http');
const chaiSpies = require('chai-spies');
const expect = chai.expect;
const mongo = require('../models').mongo;
const Recipe = mongo.Recipe;

const dbURL = 'mongodb://' + (process.env.MONGOURL || 'localhost/findmyappetite');

const testExpectOkHtml = path =>
    it(`GET ${path} responds with 200 and HTML`, () => {
        return server.get(path)
            .then(res => {
                expect(res).to.have.status(200);
                expect(res).to.be.html;
            })
            .catch(err => {
                throw new Error(err);
            });
    });

chai.use(chaiHttp);
chai.use(chaiSpies);

const server = chai.request(require('../app.js'));

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
    let db = null;

    this.timeout(1000);

    before(() =>
        Camo.connect(dbURL)
            .then(_db => {
                db = _db;
                db.dropDatabase();
            })
    );

    after(() => db.dropDatabase());

    testExpectOkHtml('/');
    testExpectOkHtml('/design');
    testExpectOkHtml('/discover');
    testExpectOkHtml('/favorites');
    testExpectOkHtml('/pantry');

    it(`GET /recipe/[new test recipe] responds with 200 and HTML`, () => {
        return recipe.save()
            .then(newRecipe => {
                return server.get(`/recipe/${newRecipe.uuid}`);
            })
            .then(res => {
                expect(res).to.have.status(200);
                expect(res).to.be.html;
            })
            .catch(err => {
                throw new Error(err);
            });
    });

    it('GET /NOT_A_RESOURCE responds with 404', () => {
        const spy = chai.spy();
        return server.get('/NOT_A_RESOURCE')
            .then(spy)
            .catch(err => {
                const res = err.response;
                expect(res).to.have.status(404);
            })
            .then(() => {
                expect(spy).not.to.have.been.called();
            });
    });
});

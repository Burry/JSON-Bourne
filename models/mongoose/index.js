'use strict';

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const loremIpsum = require('lorem-ipsum');
const mongoose = require('mongoose');
const basename = path.basename(module.filename);
const db = {};

// Connect to MongoDB
mongoose.connect('mongodb://localhost/findmyappetite', {useMongoClient: true});
mongoose.connection.on('error', console.error.bind(console, 'Mongoose error:'));

// Import models
fs.readdirSync(__dirname)
    .filter(file =>
        (file.indexOf('.') !== 0) &&
        (file !== basename) &&
        (file.slice(-3) === '.js'))
    .forEach(file => {
        const modelName = file.slice(0, -3);
        const model = require('./' + modelName);
        db[modelName] = model;
    });

// min inclusive, max exclusive
const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
};

const createObject = (obj, model) => {
    return new Promise((resolve, reject) => {
        model.findOrCreate(obj, (err, newObj) => {
            if (err) reject(err);
            else resolve(newObj);
        })
    });
};

const createIngredient = ingredient => {
    return createObject(ingredient, db.Ingredient);
};

const createRecipe = recipe => {
    return createObject(recipe, db.Recipe);
};

const createTag = tag => {
    return createObject(tag, db.Tag);
};

// Test data
if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
    let ingredients = [];
    let recipes = [];
    let tags = [
        {name: 'vegetarian', type: 'preference'},
        {name: 'vegan', type: 'preference'},
        {name: 'kosher', type: 'preference'},
        {name: 'halal', type: 'preference'},
        {name: 'gluten-free', type: 'health'},
        {name: 'lactose-free', type: 'health'},
        {name: 'nut-free', type: 'health'},
        {name: 'shellfish-free', type: 'health'},
        {name: 'atkins', type: 'diet'},
        {name: 'paleo', type: 'diet'},
        {name: 'keto', type: 'diet'}
    ];
    let ingredientIds = [];
    let tagIds = [];

    for (let i = 0; i < 500; i++) {
        let calFromFat = getRandomInt(0, 901);
        let satFat = getRandomInt(0, 50);
        let transFat = getRandomInt(0, 50);
        let ingredient = {
            name: loremIpsum({
                count: getRandomInt(1, 3),
                units: 'words',
                rand: Math.random
            }),
            avgPrice: getRandomInt(1, 11), // price in USD
            tags: [],
            nutrition: {
                calories: {
                    fromFat: calFromFat,
                    total: calFromFat + getRandomInt(0, 500)
                },
                fat: { // in grams
                    saturated: satFat,
                    trans: transFat,
                    total: satFat + transFat + getRandomInt(0, 50)
                },
                cholesterol: getRandomInt(0, 101), // in mg
                sodium: getRandomInt(0, 801), // in mg
                carbs: getRandomInt(0, 51), // in grams
                fiber: getRandomInt(0, 16), // in grams
                sugars: getRandomInt(0, 51), // in grams
                protein: getRandomInt(0, 51), // in grams
                calcium: getRandomInt(0, 301) // in mg
            }
        };
        ingredients.push(ingredient);
    }

    for (let i = 0; i < 100; i++) {
        let steps = [];
        for (let j = 0; j < getRandomInt(2, 11); j++)
            steps.push(loremIpsum({
                count: getRandomInt(1, 4),
                units: 'sentences',
                rand: Math.random
            }));
        recipes.push({
            name: loremIpsum({
                count: getRandomInt(1, 4),
                units: 'words',
                rand: Math.random
            }),
            origURL: '',
            steps: steps,
            time: { // time in minutes
                prep: getRandomInt(0, 61),
                cook: getRandomInt(0, 61)
            },
            author: loremIpsum({
                count: 1,
                units: 'words',
                rand: Math.random
            }), // Sequelize user primary key
            likes: getRandomInt(0, 101),
            created: new Date(),
            ingredients: [],
            tags: []
        });
    }

    console.info('Populating test database');
    console.info('Populating tags');
    Promise.all(tags.map(createTag))
        .then(tags => {
            tagIds = tags.map(tag => tag._id);
            ingredients = ingredients.map(ingredient => {
                for (let i = 0; i < getRandomInt(0, 5); i++)
                    ingredient.tags.push(tagIds[getRandomInt(0, tagIds.length)]);
                return ingredient;
            });
            console.info('Populating ingredients');
            return Promise.all(ingredients.map(createIngredient));
        }).then(ingredients => {
            ingredientIds = ingredients.map(ingredient => ingredient._id);
            recipes = recipes.map(recipe => {
                for (let i = 0; i < getRandomInt(0, 5); i++)
                    recipe.tags.push(tagIds[getRandomInt(0, tagIds.length)]);
                for (let i = 0; i < getRandomInt(0, 10); i++)
                    recipe.ingredients.push(ingredientIds[getRandomInt(0, ingredientIds.length)]);
                return recipe;
            });
            console.info('Populating recipes');
            return Promise.all(recipes.map(createRecipe))
        }).then(recipes => {
            console.info(
                'Created test objects for:\n '
                + ingredientIds.length + ' ingredients\n '
                + recipes.length + ' recipes\n '
                + tagIds.length + ' tags'
            );
        }).catch(err => {
            console.error(err);
        })
}

// Test recipe creation
// let chickenPotPie = new db.Recipe({
//     name: 'Mom\'s Chicken Pot Pie',
//     origURL: 'http://allrecipes.com/recipe/234974/moms-chicken-pot-pie',
//     steps: [
//         'Preheat oven to 425 degrees F (220 degrees C).',
//         'Melt butter in a large skillet over medium heat. Cook and stir onion, flour, salt, and pepper in melted butter until the onion is translucent, about 5 minutes.',
//         'Remove skillet from heat and pour chicken broth and milk into the skillet; bring the mixture to a boil and cook to thicken slightly, about 1 minute.',
//         'Remove skillet from heat and stir chicken, peas and carrots, and potatoes into the broth mixture.',
//         'Press one pie pastry into the bottom of a deep-dish pie pan. Pour the broth mixture into the pie pastry. Top with remaining pastry and press edges together to form a seal. Cut several slits into the top pastry. Place pie plate on a baking sheet.',
//         'Bake in preheated oven until the crust is golden brown, about 30 minutes. Let pie cool and filling thicken at room temperature for 15 to 20 minutes before cutting.'
//     ],
//     time: {
//         prep: 10,
//         cook: 40
//     },
//     author: '[SQL USER KEY]',
//     likes: 69,
//     created: new Date()
// }).save();

module.exports = db;

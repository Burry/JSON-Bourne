const chalk = require('chalk');
const mongoose = require('mongoose')
const path = require('path');
const { spawn } = require('child_process');

// Color logging functions
const logError = (data, dataW) => console.error(chalk.red(data) + (dataW ? ' ' + dataW : ''));
const logInfo = (data, dataW) => console.info(chalk.cyan(data) + (dataW ? ' ' + dataW : ''));
const logSuccess = (data, dataW) => console.info(chalk.green(data) + (dataW ? ' ' + dataW : ''));

// Trim whitespace and capitalize words
const trim = str => str.replace(/^\s+|\s+$/g, '');
const capitalize = str => str.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());

// Find or create a new Mongo document and save
const createObject = (obj, model) => {
    return new Promise((resolve, reject) => {
        model.findOrCreate(obj, (err, newObj) => {
            if (err) reject(err);
            else resolve(newObj);
        });
    });
};

const recipeCount = process.env.RECIPE_COUNT || 100;

let ingredients = [];
let recipes = [];

module.exports = (db, next) => {
    const createIngredient = ingredient => createObject(ingredient, db.Ingredient);
    const createRecipe = recipe => createObject(recipe, db.Recipe);

    const scraper = spawn('python', [
        'NVscrape.py',
        recipeCount,
        path.join(__dirname, '..', '..', 'node_modules', 'chromedriver', 'bin', 'chromedriver')
    ], {
        cwd: path.join(__dirname, '..', '..', 'bin')
    });

    logSuccess('Running Python recipe & ingredient scraper');

    // Create and save new Mongo object for recipe
    scraper.stdout.on('data', data => {
        try {
            data = JSON.parse(data);
            let collection = [];
            data.name = trim(capitalize(data.name));
            if (data.type === 'ingredient') {
                collection = ingredients;
            } else {
                collection = recipes;
                data.ingredients = data.ingredients.map(_id => mongoose.Types.ObjectId(_id));
            }
            collection.push(data);
            logSuccess(`Received ${data.type} ${collection.length}:`, data.name);
        } catch(e) {
            logInfo(data);
            logError(e);
        }
    });

    // Error logging
    scraper.stderr.on('data', data => logError(data));

    // Scraper exited — Create and save objects to database
    scraper.on('close', code => {
        logSuccess(`Python scraper exited with code ${code}`);
        Promise.all(ingredients.map(createIngredient))
            .then(() => Promise.all(recipes.map(createRecipe)))
            .then(recipes => {
                logInfo(
                    'Scraped and imported data for:\n '
                    + ingredients.length + ' ingredients\n '
                    + recipes.length + ' recipes'
                );
                next && next();
            }).catch(err => {
                logError(err);
                throw err;
            });
    });
};

const chalk = require('chalk');
const models = require('../models');
const Ingredient = models.mongo.Ingredient;
const Recipe = models.mongo.Recipe;
const path = require('path');
const { spawn } = require('child_process');
const scraper = spawn('python', ['NVscrape.py'], {
    cwd: path.join(__dirname, '..', 'bin')
});

const logError = data => console.error(chalk.red(data));
const logInfo = data => console.info(chalk.cyan(data));
const logSuccess = data => console.info(chalk.green(data));

logSuccess('Running Python scraper');

// DEBUG
let dataCount = 0;

// Create and save new Mongo object for recipe
scraper.stdout.on('data', data => {
    logSuccess(`Input ${++dataCount}`);
    try {
        data = JSON.parse(data);
        let ingredientIds = [];
        data.ingredients.forEach(ingredient => {
            let newIngredient = new Ingredient.findOrCreate(ingredient, (err, doc) => {
                if (err) logError(err);
                else ingredientIds.push(doc._id);
            });
        });
        data.ingredients = ingredientIds;
        let recipe = new Recipe(data);
        recipe.save((err, doc) => {
            if (err) logError(err);
            else logSuccess(`Saved recipe ${doc._id}`)
        });
    } catch(e) {
        logError(e);
        logInfo(data);
    }
});

// Error logging
scraper.stderr.on('data', data => logError(data));

// Scraper exited
scraper.on('close', code => logSuccess(`Python scraper exited with code ${code}`));

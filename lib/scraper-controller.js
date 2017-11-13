const chalk = require('chalk');
const models = require('../models');
const mongo = models.mongo;
const path = require('path');
const { spawn } = require('child_process');
const scraper = spawn('python', ['NVscrape.py'], {
    cwd: path.join(__dirname, '..', 'bin')
});

const logError = data => console.error(chalk.red(data));
const logInfo = data => console.info(chalk.cyan(data));
const logSuccess = data => console.info(chalk.green(data));

// Create and save new mongo object for recipe
scraper.stdout.on('data', data => {
    if (data.toString().charAt(0) === '{') {
        let ingredientIds = [];
        data.ingredients.forEach(ingredient => {
            let newIngredient = new mongo.Ingredient.findOrCreate(ingredient, (err, doc) => {
                if (err) logError(err);
                else ingredientIds.push(doc._id);
            });
        });
        data.ingredients = ingredientIds;
        let recipe = new mongo.Recipe(data);
        recipe.save((err, doc) => {
            if (err) logError(err);
            else logSuccess(`Saved recipe ${doc._id}`)
        });
    } else logInfo(data);
});

// Error logging
scraper.stderr.on('data', data => logError(data));

// Scraper exited
scraper.on('close', code => logSuccess(`Python child process exited with code ${code}`));

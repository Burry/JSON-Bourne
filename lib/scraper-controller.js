const chalk = require('chalk');
const models = require('../models');
const mongo = models.mongo;
const path = require('path');
const { spawn } = require('child_process');
const scraper = spawn('python', ['NVscrape.py'], {
    cwd: path.join(__dirname, '..', 'bin')
});

const readyToIngest = false;

const errorHandle = err => console.error(chalk.red(err));

// Create and save new mongo object for recipe
scraper.stdout.on('data', data => {
    console.info(chalk.cyan(data));
    if (data.charAt(0) === '{') {
        let ingredientIds = [];
        data.ingredients.forEach(ingredient => {
            let newIngredient = new mongo.Ingredient.findOrCreate(ingredient, (err, doc) => {
                ingredientIds.push(doc._id);
            });
        });
        data.ingredients = ingredientIds;
        let recipe = new mongo.Recipe(data);
        recipe.save(err => {
            err && errorHandle(err);
            // Saved
        });
    }
});

// Error logging
scraper.stderr.on('data', data => {
    errorHandle(data);
});

scraper.on('close', code => {
    console.info(chalk.red(`Python child process exited with code ${code}`));
});

const chalk = require('chalk');
const models = require('../models');
const mongo = models.mongo;
const path = require('path');
const { spawn } = require('child_process');
const scraper = spawn('python', ['NVscrape.py'], {
    cwd: path.join(__dirname, '..', 'bin')
});


// Create and save new mongo object for recipe
scraper.stdout.on('data', data => {
    console.info(chalk.cyan(data));
    ingredientIds = [];
    data.ingredients.forEach(ingredient => {
        let newIngredient = new mongo.Ingredient.findOrCreate(ingredient, (err, doc) => {
            ingredientIds.push(doc._id);
        });
    });
    data.ingredients = ingredientIds;
    let recipe = new mongo.Recipe(data);
    recipe.save(err => {
        if (err) console.error(chalk.red(err));
        // Saved
    });
});

scraper.stderr.on('data', data => {
    console.error(chalk.red(`Error: ${data}`));
});

scraper.on('close', code => {
    console.info(chalk.red(`Python child process exited with code ${code}`));
});

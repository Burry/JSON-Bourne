const chalk = require('chalk');
// const models = require('../models');
const path = require('path');
const { spawn } = require('child_process');
const scraper = spawn('python', ['NVscrape.py'], {
    cwd: path.join(__dirname, '..', 'bin')
});

console.info(path.join(__dirname, '..', 'bin'));

    // Create and save new mongo object for recipe
scraper.stdout.on('data', data => {
    // models.mongo.Recipe.findOrCreate
    console.info(chalk.cyan(data));

});

scraper.stderr.on('data', data => {
    console.error(chalk.red(`Error: ${data}`));
});

scraper.on('close', code => {
    console.info(chalk.red(`Python child process exited with code ${code}`));
});

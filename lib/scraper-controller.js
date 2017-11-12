const debug = require('debug')('scraper');
const models = require('../models');
const { spawn } = require('child_process');
const scraper = spawn('python', ['../bin/']);

scraper.stdout.on('data', data => {
    console.info(`stdout: ${data}`);
});

scraper.stderr.on('data', data => {
    console.error(`stderr: ${data}`);
    // Create and save new mongo object for recipe
});

scraper.on('close', code => {
    console.info(`child process exited with code ${code}`);
});

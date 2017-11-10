const fs = require('fs');

// Import models
module.exports = (directory, handleModel) => {
    return new Promise(resolve => {
        const modelNames = fs.readdirSync(directory)
            .filter(file =>
                (file.indexOf('.') !== 0) &&
                /^[A-Z]/.test(file) &&
                (file.slice(-3) === '.js'))
            .map(file => file.slice(0, -3));
        Promise.all(modelNames.map(handleModel)).then(resolve());
    });
};

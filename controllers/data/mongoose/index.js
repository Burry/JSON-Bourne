const mongoose = require('mongoose');
const mongo = mongoose.connection;

mongoose.connect('mongodb://localhost/findmyappetite', {useMongoClient: true});

mongo.on('error', console.error.bind(console, 'Mongoose error:'));

mongo.once('open', () => {
    // Schemas
    // const Ingredient = require('./Ingredient');
    // const Recipe = require('./Recipe');
    // const Tag = require('./Tag');

    // test recipe creation
    // let chickenPotPie = new Recipe({
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
    // });
    //
    // chickenPotPie.save((err, recipe) => {
    //     if (err) return console.error(err);
    // });
    //
    // console.log(chickenPotPie);
});

module.exports = {};

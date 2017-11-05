const mongoose = require('mongoose');
const mongo = mongoose.connection;
const Schema = mongoose.Schema;
mongoose.connect('mongodb://localhost/findmyappetite');

mongo.on('error', console.error.bind(console, 'Mongoose error:'));

mongo.once('open', () => {
    // recipes
    let recipeSchema = new Schema({
        name: Schema.String,
        origURL: String,
        steps: [String],
        author: String, // Sequelize UserID
        likes: Number,
        created: Date,
        ingredients: [Schema.Types.ObjectID],
        tags: [Schema.Types.ObjectID]
    });

    // ingredients
    // tags

    let Recipe = mongoose.model('Recipe', recipeSchema);
});

module.exports = {};

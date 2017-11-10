const models = require('../../models');
const Recipe = models.mongo.Recipe;
const User = models.sql.User;
const router = require('express').Router();
const key = 'recipe';

// GET /recipe
router.get('/', (req, res) => {
    const query = Recipe.findOne().populate('ingredients tags').exec();

    // TODO: cross-reference user key in recipe.author with User entity

    query.then(recipe => {
        res.render(key, {
            title: key.charAt(0).toUpperCase() + key.slice(1),
            section: key,
            recipe: recipe
        });
    });
});

module.exports = router

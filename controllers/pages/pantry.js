const router = require('express').Router();
const key = 'pantry';
const Pantry = require('../../models').sql.Pantry;

// GET /pantry
router.get('/', (req, res) =>
    Pantry.findOne({where: {UserId: req.user.id}})
        .then(pantry => res.render(key, {
            title: key.charAt(0).toUpperCase() + key.slice(1),
            section: key,
            pantry: JSON.stringify(pantry) // DEBUG
        }))
        .catch(err => res.redirect('/'))
);

exports = module.exports = router;

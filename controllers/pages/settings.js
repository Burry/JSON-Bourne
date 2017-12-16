const router = require('express').Router();
const key = 'settings';

// GET /design
router.get('/', (req, res) => {
    res.render(key, {
        title: key.charAt(0).toUpperCase() + key.slice(1),
        section: key
    });
});

exports = module.exports = router;

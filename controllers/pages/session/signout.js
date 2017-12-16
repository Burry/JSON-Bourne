const router = require('express').Router();

router.get('/', (req, res) =>
    req.session.destroy(err =>
        res.redirect('/')
    )
);

exports = module.exports = router;

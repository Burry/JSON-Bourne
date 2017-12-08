const router = require('express').Router();

router.get('/', (req, res) => {
	// Write custom signout function
	// keystone.session.signout(req, res, function() {
	// 	res.redirect('/');
	// });
    res.send('Sign out functionality in progress');
});

exports = module.exports = router;

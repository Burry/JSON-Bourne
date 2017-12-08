const router = require('express').Router();
const User = require('../../../models').sql.User;

const render = (req, res) =>
	res.render('session/sign-in', {
		title: 'Sign In',
		section: 'session',
		form: req.body
	});

// GET /signin
router.get('/', (req, res) => req.user
	? res.redirect(req.cookies.target || '/')
	: render(req, res)
);

// POST /signin
router.post('/', (req, res) => {
	if (!req.body.email || !req.body.password) {
		// req.flash('error', 'Please enter your username and password.');
		return render(req, res);
	}

	let onSuccess = () => {
		if (req.body.target && !/join|sign-in/.test(req.body.target)) {
			console.log('[sign-in] - Set target as [' + req.body.target + '].');
			res.redirect(req.body.target);
		} else res.redirect('/');
	}

	let onFail = () => {
		// req.flash('error', 'Your username or password were incorrect, please try again.');
		return render(req, res);
	}

	// Sign in, create new Express session, etc.
	// keystone.session.signin({email: req.body.email, password: req.body.password}, req, res, onSuccess, onFail)
});

exports = module.exports = router;

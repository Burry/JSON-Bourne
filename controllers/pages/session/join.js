const async = require('async');
const router = require('express').Router();
const User = require('../../../models').sql.User;

const render = (req, res) =>
	res.render('session/join', {
		title: 'Join',
		section: 'session',
		form: req.body
	});

// GET /join
router.get('/', (req, res) => req.user
	? res.redirect(req.cookies.target || '/')
	: render(req, res)
);

// POST /join
router.post('/', (req, res) => {
	if (req.user) return res.redirect(req.cookies.target || '/');

	async.series([
		function(cb) {
			if (!req.body.firstName || !req.body.lastName || !req.body.email || !req.body.password) {
				// req.flash('error', 'Please enter a name, email and password.');
				return cb(true);
			}
			return cb();
		},

		function(cb) {
			User.findOne({where: {email: req.body.email}}).then(user => {
				if (user) {
					// req.flash('error', 'User already exists with that email address.');
					return cb(true);
				}
				return cb();
			});
		},

		function(cb) {
			let userData = {
				firstName: req.body.firstName,
				lastName: req.body.lastName,
				email: req.body.email,
				password: req.body.password
			};

			User.create(userData).then(user => cb());
		}
	], function(err) {
		if (err) return render(req, res);

		let onSuccess = () => {
			if (req.body.target && !/join|sign-in/.test(req.body.target)) {
				console.log('[join] - Set target as [' + req.body.target + '].');
				res.redirect(req.body.target);
			} else res.redirect('/');
		};

		let onFail = e => {
			// req.flash('error', 'There was a problem signing you in, please try again.');
			return render(req, res);
		};

		// Sign in, create new Express session, etc.
		// keystone.session.signin({email: req.body.email, password: req.body.password}, req, res, onSuccess, onFail)
	});
});

exports = module.exports = router;

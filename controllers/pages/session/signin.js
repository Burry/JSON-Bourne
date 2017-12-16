const bcrypt = require('bcrypt');
const passport = require('passport');
const passportLocalStrategy = require('passport-local');
const router = require('express').Router();
const User = require('../../../models').sql.User;

passport.use('local-signin', new passportLocalStrategy(
	{
		usernameField : 'email',
		passwordField : 'password',
		passReqToCallback : true
	},
	(req, email, password, done) =>
		User.findOne({where: {email: email}}).then(user => {
			if (!user)
				return done(null, false, {message: 'Email does not exist'});
			if (!bcrypt.compareSync(password, user.password))
				return done(null, false, {message: 'Incorrect password'});
			return done(null, user.get());
		}).catch(err => {
			console.error(err);
			return done(null, false, {message: 'Something went wrong with your sign-in'});
		})
));

// GET /signin
router.get('/', (req, res) => req.user
	? res.redirect(req.cookies.target || '/')
	: res.render('session/sign-in', {
		title: 'Sign In',
		section: 'session',
		form: req.body
	})
);

// POST /signin
router.post('/', (req, res) =>
	passport.authenticate('local-signin', {
		successRedirect: req.cookies.target || '/',
		failureRedirect: '/sign-in'
	})(req, res, () => {})
);

exports = module.exports = router;

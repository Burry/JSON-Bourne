const bcrypt = require('bcrypt');
const passport = require('passport');
const passportLocalStrategy = require('passport-local');
const router = require('express').Router();
const models = require('../../../models');
const Pantry = models.sql.Pantry;
const User = models.sql.User;

passport.use('local-signup', new passportLocalStrategy(
	{
		usernameField : 'email',
		passwordField : 'password',
		passReqToCallback : true
	},
	(req, email, password, done) => {
		let newUser = null;
		User.findOne({where: {email: email}})
			.then(user => user
				? done(null, false, {message: 'This email is already in use'})
				: User.create({
						email: email,
						password: bcrypt.hashSync(password, bcrypt.genSaltSync(8), null),
						firstName: req.body.firstName,
						lastName: req.body.lastName
					})
			)
			.then(_newUser => {
				if (_newUser) {
					newUser = _newUser;
					return Pantry.create({UserId: newUser.id});
				} else return done(null, false);
			})
			.then(newPantry => newPantry
				? done(null, newUser)
				: done(null, false))
			.catch(err => {
				console.error(err);
				return done(null, false, {message: 'Something went wrong with your sign-up'});
			})
	}
));

// GET /join
router.get('/', (req, res) => req.user
	? res.redirect(req.cookies.target || '/')
	: res.render('session/join', {
		title: 'Join',
		section: 'session',
		form: req.body
	})
);

// POST /join
router.post('/', (req, res) =>
	passport.authenticate('local-signup', {
		successRedirect: req.cookies.target || '/',
		failureRedirect: '/join'
	})(req, res, () => {})
);

exports = module.exports = router;

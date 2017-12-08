const router = require('express').Router();
const User = require('../../../models').sql.User;

const render = res =>
	res.render('session/reset-password', {
        title: 'Reset Password',
        section: 'session'
    });

const init = (req, res, next) =>
	User.findOne({where: {resetPasswordKey: req.params.key}}).then(user => {
		if (!user) {
			// req.flash('error', "Sorry, that reset password key isn't valid.");
			return res.redirect('/forgot-password');
		}
		res.locals.found = user;
		next(res);
	});

// GET /reset-password
router.get('/', (req, res) => init(req, res, render));

// POST /reset-password
router.post('/', (req, res) => {
	init(req, res, newRes => {
		if (!req.body.password || !req.body.password_confirm) {
			// req.flash('error', "Please enter, and confirm your new password.")
			return render(newRes);
		}

		if (req.body.password != req.body.password_confirm) {
			// req.flash('error', 'Please make sure both passwords match.')
			return render(newRes);
		}

		locals.found.update({
			password: req.body.password,
			resetPasswordKey: ''
		}).then(() => {
			// req.flash('success', 'Your password has been reset, please sign in.');
			newRes.redirect('/sign-in');
		});
	});
});

exports = module.exports = router;

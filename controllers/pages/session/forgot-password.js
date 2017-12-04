const router = require('express').Router();
const User = require('../../../models').sql.User;

const render = res =>
	res.render('session/forgot-password', {
        title: 'Forgot Password',
        section: 'session'
    });

// GET /forgot-password
router.get('/', render(res));

// POST /forgot-password
router.post('/', (req, res) => {
	const letRender = true;
	if (!req.body.email) {
		// req.flash('error', "Please enter an email address.");
	} else User.findOne({where: {email: req.body.email}}).then(user => {
		if (user)
			user.resetPassword((err) => {
				if (err) {
					console.error('===== ERROR sending reset password email =====');
					console.error(err);
					// req.flash('error', 'Error sending reset password email. Please <a href="/about" class="alert-link">let&nbsp;us&nbsp;know</a> about this error');
				} else {
					// req.flash('success', 'We have emailed you a link to reset your password');
					res.redirect('/sign-in');
					letRender = false;
				}
			});
		// else req.flash('error', "Sorry, we don't recognise that email address.")
	});

	letRender && render(res);
});

exports = module.exports = router;

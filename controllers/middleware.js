const _ = require('lodash');

// Renders the error page
function renderError(req, res, err) {
	res.status(err.status || 500);
	res.render('error', {
		err: req.app.get('env') === 'development' ? err.err : {},
		title: err.title,
		errorMsg: err.message
	});
}

// Initialises the standard view locals
exports.initLocals = (req, res, next) => {
	res.locals.navLinks = [
		{label: 'Discover', key: 'discover', href: '/discover'},
		{label: 'Favorites', key: 'favorites', href: '/favorites'},
		{label: 'Pantry', key: 'pantry', href: '/pantry'},
		{label: 'Design', key: 'design', href: '/design'}
	];
	res.locals.query = req.url.split("?")[0];
	res.locals.user = req.user;
	next();
};

// Fetches and clears the flashMessages before a view is rendered
// exports.flashMessages = (req, res, next) => {
//     let flashMessages = {
//         info: req.flash('info'),
//         success: req.flash('success'),
//         warning: req.flash('warning'),
//         error: req.flash('error')
//     };
//     res.locals.messages = _.any(flashMessages, msgs => msgs.length) ? flashMessages : false;
//     next();
// };

// Catches 404 errors
exports.catch404 = (req, res) => {
	let err = new Error('Not Found');
	renderError(req, res, {
		err: err,
		status: 404,
		title: 'Not Found',
		message: 'Oops, looks like you tried to access a page that doesn\'t exist.'
	});
};

// Catches all other errors
exports.catchErrors = (err, req, res, next) => {
	if (err) renderError(req, res, {
		err: err,
		title: 'Oops.. we have a problem',
		message: 'Something\'s gone wrong on our end.'
	});
	next();
}

// Prevents non-admins from accessing protected pages
exports.requireAdmin = (req, res, next) => {
	if (!req.user.isAdmin) {
		res.status(403);
		req.render('error', {error: 'You\'re not authorized to access this page.'});
	} else next();
}

// Prevents people from accessing user-specific pages when they're not signed in
exports.requireUser = (req, res, next) => {
	if (!req.user) {
		req.flash('error', 'Please sign in to access this page.');
		res.redirect('/keystone/signin');
	} else next();
}

// Pages not applicable to signed-in users
exports.requireNoUser = (req, res, next) => {
	if (req.user) res.redirect('/');
	else next();
}

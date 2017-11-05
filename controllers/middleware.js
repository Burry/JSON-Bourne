// Renders the error page
function renderError(req, res, err) {
	res.status(err.status || 500).render('error', {
		err: req.app.get('env') === 'development' ? err.err : {},
		title: err.title,
		errorMsg: err.message
	})
}

// Initialises the standard view locals
exports.initLocals = (req, res, next) => {
	res.locals.navLinks = [
		{label: 'Discover', key: 'discover', href: '/discover'},
		{label: 'Favorites', key: 'favorites', href: '/favorites'},
		{label: 'Pantry', key: 'pantry', href: '/pantry'},
		{label: 'Design', key: 'design', href: '/design'}
	]
	next()
}

// Catches 404 errors
exports.catch404 = (req, res) => {
	let err = new Error('Not Found')
	err.status = 404
	renderError(req, res, {
		err: err,
		title: 'Not Found',
		message: 'Oops, looks like you tried to access a page that doesn\'t exist.'
	})
}

// Catches all other errors
exports.catchErrors = (err, req, res, next) => {
	if (err) renderError(req, res, {
		err: err,
		title: 'Oops.. we have a problem',
		message: 'Something\'s gone wrong on our end.'
	})
	next()
}
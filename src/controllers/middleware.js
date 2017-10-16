import PrettyError from 'pretty-error';
import config from '../config';

// Renders the error page and logs to console
function renderError(req, res, err) {
	const pe = new PrettyError();
	pe.skipNodeFiles();
	pe.skipPackage('express');
	console.error(pe.render(err));

	res.status(err.status || 500).render('error', {
		err: __DEV__ ? err.err : {},
		title: err.title,
		errorMsg: err.message
	});
}

// Initialises the standard view locals
export const initLocals = (req, res, next) => {
	res.locals.navLinks = [
		{label: 'Discover', key: 'discover', href: '/discover'},
		{label: 'Favorites', key: 'favorites', href: '/favorites'},
		{label: 'Pantry', key: 'pantry', href: '/pantry'},
		{label: 'Design', key: 'discover', href: '/design'}
	];
	res.locals.analyticsID = config.analyticsID;
	next();
};

// Catches 404 errors
export const catch404 = (req, res) => {
	let err = new Error('Not Found');
	err.status = 404;
	renderError(req, res, {
		err: err,
		title: 'Not Found',
		message: 'Oops, looks like you tried to access a page that doesn\'t exist.'
	});
};

// Clear cookies upon JWT authentication errors
export const catchJWTError = (err, req, res, next) => {
	// eslint-disable-line no-unused-vars
	if (err instanceof Jwt401Error) {
		console.error('[express-jwt-error]', req.cookies.id_token);
		// `clearCookie`, otherwise user can't use web-app until cookie expires
		res.clearCookie('id_token');
	}
	next(err);
};

// Catches all other errors
export const catchErrors = (err, req, res, next) => {
	if (err) renderError(req, res, {
		err: err,
		title: 'Oops.. we have a problem',
		message: 'Something\'s gone wrong on our end.'
	});
	next();
};

export default {
	initLocals,
	catch404,
	catchJWTError,
	catchErrors
};

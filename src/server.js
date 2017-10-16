// Application entry point

import path from 'path';
import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import expressJwt, { UnauthorizedError as Jwt401Error } from 'express-jwt';
import jwt from 'jsonwebtoken';
import controller from './controllers/index';
// import passport from './lib/passport';
// import models from './models';
import assets from './assets.json'; // eslint-disable-line import/no-unresolved
import config from './config';

const app = express();

// View engine setup
app.set('views', path.join(__dirname, 'templates', 'views'));
app.set('view engine', 'pug');

// Tell any CSS tooling (such as Material UI) to use all vendor prefixes if the
// user agent is not known.
global.navigator = global.navigator || {};
global.navigator.userAgent = global.navigator.userAgent || 'all';

// Host static files from /public
app.use(express.static(path.join(__dirname, 'public')));

// Parse incoming request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Parse cookie headers, populate req.cookies with an object keyed by cookie names
app.use(cookieParser());

// Authentication
app.use(expressJwt({
	secret: config.auth.jwt.secret,
	credentialsRequired: false,
	getToken: req => req.cookies.id_token
}));

// Use controller / Router
app.use('/', controller);

// Initialize Passport (authentication middleware)
// app.use(passport.initialize());

// Trust BrowserSync proxying in development
if (__DEV__) app.enable('trust proxy');

// Launch the server
// const syncModels = models.sync().catch(err => console.error(err.stack));
if (!module.hot) {
	syncModels.then(() => {
		app.listen(config.port, () => {
			console.info(`The server is running at http://localhost:${config.port}/`);
		});
	});
}

// Hot Module Replacement
if (module.hot) {
	app.hot = module.hot;
	module.hot.accept('./controllers');
}

export default app;

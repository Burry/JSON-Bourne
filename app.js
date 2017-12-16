require('dotenv').config();
const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const controllers = require('./controllers');
const passport = require('passport');
const session = require('express-session');
const User = require('./models').sql.User;

const app = express();

// View engine setup
app.set('views', path.join(__dirname, 'client', 'views', 'pages'));
app.set('view engine', 'pug');

// Log for development enviornment
app.use(logger('dev'));

// Parse incoming request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Authentication & sessions
app.use(session({
    secret: process.env.SESSION_SECRET || 'FindMyAppetite-F-2017-3308',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser((user, done) =>
    done(null, user.id)
);
passport.deserializeUser((id, done) => {
    User.findById(id).then(user => user
        ? done(null, user.get())
        : done(user.errors, null)
    );
});

// Parse cookie headers, populate req.cookies with an object keyed by cookie names
app.use(cookieParser());

// Host static files from /client/build
app.use(express.static(path.join(__dirname, 'client', 'build')));

// Set global variables
app.locals.env = app.get('env');

// Controllers / Routes
app.use('/', controllers);

module.exports = app;

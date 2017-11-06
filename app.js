const express = require('express')
const path = require('path')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const controllers = require('./controllers')

// Sequelize debugging
const models = require('./models');
const sql = models.sql;
sql.User.create({
    firstName: 'Jon',
    lastName: 'Doe',
    email: 'jondoe@gmail.com',
    password: 'hunter2'
}).then(() => {
    return sql.User.findAll();
}).then(users => {
    console.log('Users: ', users);
});

const app = express()

// View engine setup
app.set('views', path.join(__dirname, 'client', 'views', 'pages'))
app.set('view engine', 'pug')

// Log for development enviornment
app.use(logger('dev'))

// Parse incoming request bodies
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// Parse cookie headers, populate req.cookies with an object keyed by cookie names
app.use(cookieParser())

// Host static files from /client/build
app.use(express.static(path.join(__dirname, 'client', 'build')))

// Set global variables
app.locals.env = app.get('env')

// Controllers / Routes
app.use('/', controllers)

module.exports = app

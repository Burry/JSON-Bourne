require('dotenv').config()
const express = require('express')
const path = require('path')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
<<<<<<< HEAD
const routes = require('./controllers/index')
=======
const db = require('./controllers/data')
const routes = require('./controllers/routes')
>>>>>>> 30fea4205bcafbc290143526763cf4eb83f2bdfb

const app = express()

// View engine setup
<<<<<<< HEAD
app.set('views', path.join(__dirname, 'views', 'pages'))
=======
app.set('views', path.join(__dirname, 'client', 'views', 'pages'))
>>>>>>> 30fea4205bcafbc290143526763cf4eb83f2bdfb
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

// Routes
app.use('/', routes)

module.exports = app

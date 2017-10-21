require('dotenv').config()
const express = require('express')
const path = require('path')
// const favicon = require('serve-favicon')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const routes = require('./controllers/index')

const app = express()

// View engine setup
app.set('views', path.join(__dirname, 'views', 'pages'))
app.set('view engine', 'pug')

// app.use(favicon(path.join(__dirname, 'public', 'icons', 'favicon.ico')))

// Log for development enviornment
app.use(logger('dev'))

// Parse incoming request bodies
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// Parse cookie headers, populate req.cookies with an object keyed by cookie names
app.use(cookieParser())

// Host static files from /public
app.use(express.static(path.join(__dirname, 'public')))

// Set global variables
app.locals.env = app.get('env')

// Routes
app.use('/', routes)

module.exports = app

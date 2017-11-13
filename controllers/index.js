const middleware = require('./middleware')
const router = require('express').Router()

// Implement middleware
router.use(middleware.initLocals)
router.use(middleware.catchErrors)

// Pages
router.use('/', require('./pages/index'))
router.use('/recipe', require('./pages/recipe'))
router.use('/discover', require('./pages/discover'))
router.use('/favorites', require('./pages/favorites'))
router.use('/pantry', require('./pages/pantry'))
router.use('/design', require('./pages/design'))

// Authentication

// User

// Handle 404 errors — must be bellow all other routes
router.use(middleware.catch404)

exports = module.exports = router

const middleware = require('./middleware')
const router = require('express').Router()

// Implement middleware
router.use(middleware.initLocals)
router.use(middleware.catchErrors)

// Views
router.use('/', require('./views/index'))
router.use('/discover', require('./views/discover'))
router.use('/favorites', require('./views/favorites'))
router.use('/pantry', require('./views/pantry'))
router.use('/design', require('./views/design'))

// Authentication

// User

// Handle 404 errors — must be bellow all other routes
router.use(middleware.catch404)

exports = module.exports = router

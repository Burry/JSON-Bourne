const middleware = require('./middleware')
const router = require('express').Router()

// Implement middleware
router.use(middleware.initLocals)
router.use(middleware.catchErrors)
// router.use(middleware.flashMessages)

// Pages
router.use('/', require('./pages/index'));
router.use('/recipe', require('./pages/recipe'));
router.use('/discover', require('./pages/discover'));
router.use('/favorites', require('./pages/favorites'));
router.use('/pantry', require('./pages/pantry'));
router.use('/design', require('./pages/design'));

// Session
router.use('/join', require('./pages/session/join'));
router.use('/sign-in', require('./pages/session/signin'));
router.use('/sign-out', require('./pages/session/signout'));

// Authentication
router.use('/auth/confirm', require('./auth/confirm'));
router.use('/auth/facebook', require('./auth/facebook'));

// User
router.use('/settings*', middleware.requireUser, require('./pages/settings'));

// Handle 404 errors — must be bellow all other routes
router.use(middleware.catch404);

exports = module.exports = router;

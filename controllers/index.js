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
router.use('/join', middleware.requireNoUser);
router.use('/join', require('./pages/session/join'));
router.use('/sign-in', middleware.requireNoUser);
router.use('/sign-in', require('./pages/session/signin'));
router.get('/sign-out', require('./pages/session/signout'));
router.use('/forgot-password', require('./pages/session/forgot-password'));
router.use('/reset-password/:key', require('./pages/session/reset-password'));

// Authentication
// router.use('/auth/confirm', require('./auth/confirm'));
// router.use('/auth/:service', require('./auth/service'));

// User
// router.use('/settings*', middleware.requireUser);
// router.use('/settings', routes.views.settings);

// NOTE: To protect a route so that only admins can see it, use the requireUser middleware:
// app.get('/protected', middleware.requireUser, [[protectedRoute]]);

// Handle 404 errors — must be bellow all other routes
router.use(middleware.catch404);

exports = module.exports = router;

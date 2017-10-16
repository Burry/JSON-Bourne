import express from 'express';
const router = express.Router();
import {
	initLocals,
	catch404,
	catchJWTError,
	catchErrors
} from './middleware';

// Implement middleware
router.use(initLocals);
router.use(catchJWTError);
router.use(catchErrors);

// Views
import index from './views/index';
import discover from './views/discover';
import favorites from './views/favorites';
import pantry from './views/pantry';
import design from './views/design';

router.use('/', index);
router.use('/discover', discover);
router.use('/favorites', favorites);
router.use('/pantry', pantry);
router.use('/design', design);

// Authentication

// User

// Handle 404 errors — must be bellow all other routes
router.use(catch404);

export default router;

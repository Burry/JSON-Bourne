import express from 'express';
const router = express.Router();
const key = 'pantry';

// GET /pantry
router.get('/', (req, res) => {
    res.render(key, {
        title: key.charAt(0).toUpperCase() + key.slice(1),
        section: key
    });
});

export default router;

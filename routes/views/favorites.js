const router = require('express').Router()
const key = 'favorites'

// GET /favorites
router.get('/', (req, res) => {
    res.render(key, {
        title: key.charAt(0).toUpperCase() + key.slice(1),
        section: key
    })
})

module.exports = router
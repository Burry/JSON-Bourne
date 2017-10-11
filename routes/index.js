const express = require('express')
const router = express.Router()

/* GET home page. */
router.get('/', (req, res) => {
    res.render('views/index', { title: 'FindMyAppetite' });
})

module.exports = router

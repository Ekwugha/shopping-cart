const express = require('express');
const router = express.Router();


// get /
router.get('/', (req, res) => {
    res.render('index', { title: 'Home'})
})



// get a page
router.get('/:slug', (req, res) => {
    res.render('index', { title: 'Home'})
})



// exports
module.exports = router;
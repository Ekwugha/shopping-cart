const express = require('express');
const router = express.Router();

// Get product model
let Product = require('../models/product')


// get /
router.get('/', (req, res) => {
    Page.findOne({slug: 'home'}, (err, page) => {
        if (err)
            console.log(err);

        res.render('index', {
            title: page.title,
            content: page.content
        });
    });
})




// exports
module.exports = router;
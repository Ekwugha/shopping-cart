const express = require('express');
const router = express.Router();

// Get page model
let Page = require('../models/page')


// get /
router.get('/', (req, res) => {
    Page.findOne({slug: 'home'}, (err, page) => {
        if (err)
            console.log(err);

        res.render('index', {
            // title: page.title,
            content: page.content
        });
    });
})



// get a page
router.get('/:slug', (req, res) => {

    let slug = req.params.slug;

    Page.findOne({slug: slug}, (err, page) => {
        if (err) console.log(err);
        if (!page) {
            res.redirect('/');
            // pages: null
        } else {
            res.render('index', { 
                title: page.title,
                content: page.content
            })
        }
    })
})



// exports
module.exports = router;
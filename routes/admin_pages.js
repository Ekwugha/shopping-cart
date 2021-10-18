const express = require('express');
const router = express.Router();

// Get page model
var Page = require('../models/page')

// Get pages index

router.get('/', (req, res) => {
    res.send('admin area');
});


// Get add page

router.get('/add-page', (req, res) => {
    const title = "";
    const slug = "";
    const content = ""; 

    res.render('admin/add_page', { title, slug, content })
});

// Post add page

router.post('/add-page', (req, res) => {
    req.checkBody ('title', 'Title must have a value').notEmpty();
    req.checkBody ('content', 'Content must have a value').notEmpty();

    const title = req.body.title;
    let slug = req.body.slug.replace(/\s+/g, '-').toLowerCase();
    if (slug == "") slug = title.replace(/\s+/g, '-').toLowerCase();
    const content = req.body.content;

    const errors = req.validationErrors();

    if (errors) {
            res.render('admin/add_page', {
            errors: errors,
            title: title,
            slug: slug,
            content: content
        });
    } else {
        Page.findOne({slug: slug}, (err, page) => {
            if (page) {
                req.flash('danger', 'Page slug exists, choose another.');
                res.render('admin/add_page', {
                    title: title,
                    slug: slug,
                    content: content
                });
            } else {
                const page = new Page({
                    title: title,
                    slug: slug,
                    content: content,
                    sorting: 0
                })
                page.save((err) => {
                    if (err) return console.log(err);

                    req.flash('success', 'Page added!');
                    res.redirect('/admin/pages')
                })
            }
        })
    }
    
    

    // res.render('admin/add_page', { title, slug, content })
});

// exports
module.exports = router;
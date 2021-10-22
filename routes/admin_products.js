const express = require('express');
const router = express.Router();
const mkdirp = require('mkdirp');
const fs = require('fs-extra');
const resizeImg = require('resize-img');

// Get product model
const Product = require('../models/product')

// Get category model
const Category = require('../models/category')

// Get products index

router.get('/', (req, res) => {
    var count;

    Product.count((err, c) => {
        count = c;
    });

    Product.find((err, products) => {
        res.render('admin/products', {
            products: products,
            count: count
        })
    })
    
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
                    sorting: 100
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

// Post reorder pages

router.post('/reorder-pages', (req, res) => {
    let ids = req.body['id[]'];
    
    let count = 0;

    for (let i = 0; i < ids.length; i++) {
        let id = ids[i];
        count++;
        
        ((count) => {
            Page.findById(id, (err, page) => {
                page.sorting = count;
                page.save ((err) => {
                    if (err) return console.log(err);
                })
            })
        })(count)
    }
});

// Get edit page

router.get('/edit-page/:id', (req, res) => {
    Page.findById( req.params.id , (err, page) => {
        if (err) return console.log(err);

        res.render('admin/edit_page', {
            title: page.title,
            slug: page.slug,
            content: page.content,
            id: page._id
        })
    }) 

});


// Post edit page

router.post('/edit-page/:id', (req, res) => {
    req.checkBody ('title', 'Title must have a value').notEmpty();
    req.checkBody ('content', 'Content must have a value').notEmpty();

    const title = req.body.title;
    let slug = req.body.slug.replace(/\s+/g, '-').toLowerCase();
    if (slug == "") slug = title.replace(/\s+/g, '-').toLowerCase();
    const content = req.body.content;
    const id = req.params.id;

    const errors = req.validationErrors();

    if (errors) {
            res.render('admin/edit_page', {
            errors: errors,
            title: title,
            slug: slug,
            content: content,
            id: id
        });
    } else {
        Page.findOne({slug: slug, _id:{'$ne': id}}, (err, page) => {
            if (page) {
                req.flash('danger', 'Page slug exists, choose another.');
                res.render('admin/edit_page', {
                    title: title,
                    slug: slug,
                    content: content,
                    id: id
                });
            } else {
                Page.findById(id, (err, page) => {
                    if (err) return console.log(err);
                    page.title = title,
                    page.slug = slug,
                    page.content = content
                    page.save((err) => {
                        if (err) return console.log(err);
    
                        req.flash('success', 'Page added!');
                        res.redirect('/admin/pages/edit-page/'+ id)
                    })
                })
            }
        })
    }
});



// Get delete page

router.get('/delete-page/:id', (req, res) => {
    Page.findByIdAndRemove(req.params.id, (err, page) => {
        if (err) return console.log(err);
        req.flash('success', 'Page deleted!');
        res.redirect('/admin/pages/')
    })
});

// exports
module.exports = router;
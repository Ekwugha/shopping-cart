const express = require('express');
const router = express.Router();

// Get Category model
const Category = require('../models/category')

// Get pages index

router.get('/', (req, res) => {
    Category.find((err, categories) => {
        if(err) console.log(err);
        res.render('admin/categories', { categories })
    })
});


// Get add category

router.get('/add-category', (req, res) => {
    const title = "";

    res.render('admin/add_category', { title })
});

// Post add category

router.post('/add-category', (req, res) => {
    req.checkBody ('title', 'Title must have a value').notEmpty();

    const title = req.body.title;
    let slug = title.replace(/\s+/g, '-').toLowerCase();

    const errors = req.validationErrors();

    if (errors) {
        res.render('admin/add_category', {errors, title });
    } else {
        Category.findOne({slug: slug}, (err, category) => {
            if (category) {
                req.flash('danger', 'Category title exists, choose another.');
                res.render('admin/add_category', { title });
            } else {
                const category = new Category({ title, slug })
                category.save((err) => {
                    if (err) return console.log(err);

                    req.flash('success', 'Category added!');
                    res.redirect('/admin/Categories')
                })
            }
        })
    }
});

// Get edit category

router.get('/edit-category/:id', (req, res) => {
    Category.findById(req.params.id , (err, category) => {
        if (err) return console.log(err);

        res.render('admin/edit_category', {
            title: category.title,
            id: category._id
        })
    }) 

});


// Post edit category

router.post('/edit-category/:id', (req, res) => {
    req.checkBody ('title', 'Title must have a value').notEmpty();

    const title = req.body.title;
    let slug = title.replace(/\s+/g, '-').toLowerCase();
    const id = req.params.id;

    const errors = req.validationErrors();

    if (errors) {
            res.render('admin/edit_category', { errors, title, id});
    } else {
        Category.findOne({slug: slug, _id:{'$ne': id}}, (err, category) => {
            if (category) {
                req.flash('danger', 'Category title exists, choose another.');
                res.render('admin/edit_category', { title, id });
            } else {
                Category.findById(id, (err, category) => {
                    if (err) return console.log(err);
                    category.title = title,
                    category.slug = slug
                    category.save((err) => {
                        if (err) return console.log(err);
    
                        req.flash('success', 'Category edited!');
                        res.redirect('/admin/categories/edit-category/'+ id)
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
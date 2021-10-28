const express = require('express');
const router = express.Router();

// Get product model
let Product = require('../models/product');


// Get Category model
var Category = require('../models/category');


// get all product
router.get('/', function (req, res) {
    //router.get('/', isUser, function (req, res) {
    
        Product.find(function (err, products) {
            if (err)
                console.log(err);
    
            res.render('all_products', {
                title: 'All products',
                products: products
            });
        });
    
    });



/*
 * GET products by category
 */
router.get('/:category', function (req, res) {
    
        var categorySlug = req.params.category;
    
        Category.findOne({slug: categorySlug}, function (err, c) {
            Product.find({category: categorySlug}, function (err, products) {
                if (err)
                    console.log(err);
    
                res.render('cat_products', {
                    title: c.title,
                    products: products
                });
            });
        });
    
    });



// exports
module.exports = router;
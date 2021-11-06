const express = require('express');
const router = express.Router();
var fs = require('fs-extra');

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





/*
 * GET products details
 */
router.get('/:category/:product', (req, res) => {
    let galleryImages = null;
    let loggedIn = (req.isAuthenticated()) ? true : false;

    Product.findOne({slug: req.params.product}, (err, product) => {
        if (err) {
            console.log(err);
        } else {
            const galleryDir = 'public/product_images/' + product._id + '/gallery';

            fs.readdir(galleryDir, (err, files) => {
                if (err) {
                    console.log(err);
                } else {
                    galleryImages = files;

                    res.render('product', {
                        title: product.title,
                        p: product,
                        galleryImages: galleryImages,
                        loggedIn: loggedIn
                    });
                }
            });
        }
    });
    

});




// exports
module.exports = router;
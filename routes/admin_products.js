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
    let count; 

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


// Get add product

router.get('/add-product', (req, res) => {
    const title = "";
    const desc = "";
    const price = ""; 

    Category.find((err, categories) => {
        res.render('admin/add_product', { 
            title: title,
            desc: desc,
            categories: categories,
            price: price
        })
    })
});





// Post add product

router.post('/add-product', (req, res) => {

    if(!req.files){ imageFile = ""; }
    
        if(req.files){
        
        var imageFile = typeof(req.files.image) !== "undefined" ? req.files.image.name : "";
    }

    req.checkBody ('title', 'Title must have a value').notEmpty();
    req.checkBody ('desc', 'Description must have a value').notEmpty();
    req.checkBody ('price', 'Price must have a value').isDecimal();
    req.checkBody ('image', 'You must upload an image').isImage(imageFile);

    const title = req.body.title;
    const slug = title.replace(/\s+/g, '-').toLowerCase();
    const desc = req.body.desc;
    const price = req.body.price;
    const category = req.body.category;

    const errors = req.validationErrors();

    if (errors) {
        Category.find((err, categories) => {
            res.render('admin/add_product', { 
                errors: errors,
                title: title,
                desc: desc,
                categories: categories,
                price: price
            })
        })
    } else {
        Product.findOne({slug: slug}, (err, product) => {
            if (product) {
                req.flash('danger', 'Product title exists, choose another.');
                Category.find((err, categories) => {
                    res.render('admin/add_product', { 
                        title: title,
                        desc: desc,
                        categories: categories,
                        price: price
                    });
                })
            } else {
                let price2 = parseFloat(price).toFixed(2);

                const product = new Product({
                    title: title,
                    slug: slug,
                    desc: desc,
                    price: price2,
                    category: category,
                    image: imageFile
                })
                product.save((err) => {
                    if (err) return console.log(err);

                    // this create a folder for the images and save it  with the id
                    mkdirp('public/product_images/' + product._id, (err) => {
                        return console.log(err)
                    });

                    mkdirp('public/product_images/' + product._id + '/gallery' , (err) => {
                        return console.log(err)
                    });

                    mkdirp('public/product_images/'+ product._id + '/gallery/thumbs' , (err) => {
                        return console.log(err)
                    });

                    if (imageFile != "") {
                        const productImage = req.files.image;
                        const path = 'public/product_images/' + product._id + '/' + imageFile;

                        productImage.mv(path, (err) => {
                            return console.log(err);
                        })
                    }

                    req.flash('success', 'Product added!');
                    res.redirect('/admin/products')
                    
                })
            }
        })
    }
});



// Get edit product

router.get('/edit-product/:id', (req, res) => {

    let errors;

    if (req.session.errors) errors = req.session.errors;
    req.session.errors = null;

    Category.find((err, categories) => {

        Product.findById(req.params.id, (err, p) => {
            if (err) {
                console.log(error);
                res.render('/admin/products')
            } else {
                let galleryDir = 'public/product_images/' + p._id + '/gallery';
                let galleryImages = null;

                fs.readdir(galleryDir, (err, files) => {
                    if (err) {
                        console.log(err);
                    } else {
                        galleryImages = files;

                        res.render('admin/edit_product', { 
                            title: p.title,
                            errors: errors,
                            desc: p.desc,
                            categories: categories,
                            category: p.category.replace(/\s+/g, '-').toLowerCase(),
                            price: p.price,
                            image: p.image,
                            galleryImages: galleryImages,
                            id: p._id
                        });
                    }
                })
            }
        })
    });

});


// Post edit product

router.post('/edit-product/:id', (req, res) => {
    if(!req.files){ imageFile = ""; }
    
        if(req.files){
        
        var imageFile = typeof(req.files.image) !== "undefined" ? req.files.image.name : "";
    }
    
    req.checkBody ('title', 'Title must have a value').notEmpty();
    req.checkBody ('desc', 'Description must have a value').notEmpty();
    req.checkBody ('price', 'Price must have a value').isDecimal();
    req.checkBody ('image', 'You must upload an image').isImage(imageFile);

    const title = req.body.title;
    const slug = title.replace(/\s+/g, '-').toLowerCase();
    const desc = req.body.desc;
    const price = req.body.price;
    const category = req.body.category;
    const pimage = req.body.pimage;
    const id = req.params.id;

    const errors = req.validationErrors();

    if (errors) {
        req.session.errors = errors;
        res.redirect('/admin/products/edit-product/' +id);
    } else {
        Product.findOne({slug: slug, _id:{'$ne':id}}, (err, p) => {
            if (err) console.log(err);
            if (p) {
                req.flash('danger', 'Product title exists, choose another.');
                res.redirect('/admin/products/edit-product/' +id);                
            } else {
                Product.findById(id, (err, p) => {
                    if (err) console.log(err);

                    p.title = title;
                    p.slug = slug;
                    p.desc = desc;
                    p.price = parseFloat(price).toFixed(2);
                    p.category = category;
                    if (imageFile !== "") {
                        p.image = imageFile;
                    }
                    p.save((err) => {
                        if (err) console.log(err);

                        if (imageFile !== "") {
                            if (pimage !== "") {
                                fs.remove('public/product_images/' + id + '/' + pimage, (err) => {
                                    if (err) console.log(err);
                                })
                            }
                            const productImage = req.files.image;
                            const path = 'public/product_images/' + id + '/' + imageFile;
    
                            productImage.mv(path, (err) => {
                                return console.log(err);
                            })
                        }
                        req.flash('success', 'Product added!');
                        res.redirect('/admin/products/edit-product/' +id);                
                    })
                })
            }
        })
    }
});






// post product gallery


router.post('/product-gallery/:id', function (req, res) {
    
        const productImage = req.files.file;
        const id = req.params.id;
        const path = 'public/product_images/' + id + '/gallery/' + req.files.file.name;
        const thumbsPath = 'public/product_images/' + id + '/gallery/thumbs/' + req.files.file.name;
    
        productImage.mv(path,  (err) => {
            if (err)
                console.log(err);
    
            resizeImg(fs.readFileSync(path), {width: 100, height: 100}).then( (buf) =>  {
                fs.writeFileSync(thumbsPath, buf);
            });
        });
    
        res.sendStatus(200);
    
    });



// Get delete image

router.get('/delete-image/:image', (req, res) => {
    const originalImage = 'public/product_images/' + req.query.id + '/gallery/' + req.params.image;
    const thumbImage = 'public/product_images/' + req.query.id + '/gallery/thumbs/' + req.params.image;

    fs.remove(originalImage, (err) => {
        if (err) {
            console.log(err);   
        } else {
            fs.remove(thumbImage, (err) => {
                if (err) console.log(err);
                req.flash('success', 'Image deleted!');
                res.redirect('/admin/products/edit-product/' +req.query.id); 
            })
        }
    })
});



// Get delete product

router.get('/delete-product/:id', (req, res) => {
    const id = req.params.id;
    const path = 'public/product_images/' + id;

    fs.remove(path, (err) => {
        if (err) {
            console.log(err);
        } else {
            Product.findByIdAndRemove(id, (err) => {
                if (err) console.log(err);
            })
            req.flash('success', 'Product deleted!');
            res.redirect('/admin/products/')
        }
    })
});

// exports
module.exports = router;
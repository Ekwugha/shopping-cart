const express = require('express');
const router = express.Router();

// Get product model
let Product = require('../models/product')


// get add product /
router.get('/add/:product', (req, res) => {

    let slug = req.params.product;

    Page.findOne({slug: slug}, (err, page) => {
        if (err)
            console.log(err);

            if (typeof req.session.cart == "undefined") {
                req.session.cart = [];
                req.session.cart.push({
                    title: slug,
                    qty: 1,
                    price: parseFloat(p.price).toFixed(2),
                    image: '/product_images/' + p._id + '/' + p.image
                });
            } else {
                var cart = req.session.cart;
                var newItem = true;
    
                for (var i = 0; i < cart.length; i++) {
                    if (cart[i].title == slug) {
                        cart[i].qty++;
                        newItem = false;
                        break;
                    }
                }

                if (newItem) {
                    cart.push({
                        title: slug,
                        qty: 1,
                        price: parseFloat(p.price).toFixed(2),
                        image: '/product_images/' + p._id + '/' + p.image
                    });
                }
            }

//        console.log(req.session.cart);
        req.flash('success', 'Product added!');
        res.redirect('back');
    });
})




// exports
module.exports = router;
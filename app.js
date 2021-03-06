const express = require('express');
const path = require('path');
const morgan = require('morgan');
const mongoose = require('mongoose');
const config = require('./config/database');
const bodyParser = require('body-parser');
const session = require('express-session');
const expressValidator = require('express-validator');
const fileUpload = require('express-fileupload');
const passport = require('passport')


// connect to db
const dbURI = (config.database)
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => console.log('connected to mongodb'))  
    .catch((err) => console.log(err));




// init app
const app = express();





// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs')




// set global errors variable
app.locals.errors = null;




// get page model
let Page = require('./models/page');

// get all pages to pass to header.ejs
Page.find({}).sort({ sorting: 1 }).exec((err, pages) => {
    if (err) {
        console.log(err);
    } else {
        app.locals.pages = pages;
    }
})





// get category model
let Category = require('./models/category');

// get all categories to pass to header.ejs
Category.find((err, categories) => {
    if (err) {
        console.log(err);
    } else {
        app.locals.categories = categories;
    }
})




// middleware and static files
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }))
app.use(morgan ('dev'));






// express fileupload middleware
app.use(fileUpload());





// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())






// Express session middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    // cookie: { secure: true }
  }))





// Express validator
app.use(expressValidator ({
    errorFormatter: function(param, msg, value) {
        const namespace = param.split('.')
        , root = namespace.shift()
        , formParam = root;

        while(namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    },
    customValidators: {
        isImage: (value, filename) => {
            const extension = (path.extname(filename)).toLowerCase();
            switch (extension) {
                case '.jpg':
                    return '.jpg';
                case '.jpeg':
                    return '.jpeg';
                case '.png':
                    return '.png';
                case '':
                    return '.jpg';
                default:
                    return false;
            }
        }
    }
}));





// Express messsages middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});
// error is not showing
app.use(function(req, res, next){
    res.locals.message = req.flash();
    next();
});



// Passport Config
require('./config/passport')(passport);
// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());



app.get('*', (req,res,next) => {
    res.locals.cart = req.session.cart;
    res.locals.user = req.user || null;
    next();
 });



// set routes
const pages = require('./routes/pages.js');
const products = require('./routes/products.js');
const cart = require('./routes/cart.js');
const users = require('./routes/users.js');
const adminPages = require('./routes/admin_pages.js');
const adminCategories = require('./routes/admin_categories.js');
let adminProducts = require('./routes/admin_products.js');

app.use('/admin/pages', adminPages);
app.use('/admin/categories', adminCategories);
app.use('/admin/products', adminProducts);
app.use('/products', products);
app.use('/cart', cart);
app.use('/users', users);
app.use('/', pages);


// start the server
const port = process.env.PORT || 3002;
app.listen(port, () => {
    console.log(`server started on port ${port}`);
});
// app.listen(process.env.PORT || 3002, function(){
//     console.log("Express server listening on port", this.address().port, app.settings.env);
//   });
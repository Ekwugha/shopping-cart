const express = require('express');
const path = require('path');
const morgan = require('morgan');
const mongoose = require('mongoose');
const config = require('./config/database');

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

// middleware and static files
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }))
app.use(morgan ('dev'));

// set routes
const pages = require('./routes/pages.js')
const adminPages = require('./routes/admin_pages.js')

app.use('/admin/pages', adminPages)
app.use('/', pages)


// start the server
const port = 3002;
app.listen(port, () => {
    console.log(`server started on port ${port}`)
})
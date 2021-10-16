const express = require('express');
const router = express.Router();

// Get pages index

router.get('/', (req, res) => {
    res.send('admin area')
});


// Get add page

router.get('/add-page', (req, res) => {
    const title = "";
    const slug = "";
    const content = ""; 

    res.render('admin/add_page', { title, slug, content })
});

// exports
module.exports = router;
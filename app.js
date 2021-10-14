const express = require('express');
const path = require('path');

// init app
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs')

// public folder
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.send('working')
})

// start the server
const port = 3002;
app.listen(port, () => {
    console.log(`server started on port ${port}`)
})
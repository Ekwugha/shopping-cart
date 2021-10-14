const mongoose = require('mongoose');

const PageSchema = mongoose.Schema({
    title: {
        type: string,
        required: true
    },
    slug: {
        type: string
    },
    content: {
        type: string,
        required: true
    },
    sorting: {
        type: number,
    }
})

const Page = module.exports = mongoose.model('Page', PageSchema);
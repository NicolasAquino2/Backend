const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    code: {
        type: Number,
        unique: true
    },
    stock: Number,
    category: String,
    thumbnails: []
});

module.exports = mongoose.model('Product', productSchema);

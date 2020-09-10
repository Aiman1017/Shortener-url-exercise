let mongoose = require('mongoose');

let urlSchema = mongoose.Schema({
    shortUrl: Number,
    originalUrl: String
})

module.exports = mongoose.model('Url', urlSchema)
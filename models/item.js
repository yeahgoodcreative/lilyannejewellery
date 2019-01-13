// Modules
var mongoose = require('mongoose')

// Schema
var schema = new mongoose.Schema({
    itemId: String,
    description: String,
    locationId: String,
    binId: String,
    count: Number
})

// Export Model
module.exports = mongoose.model('Item', schema)
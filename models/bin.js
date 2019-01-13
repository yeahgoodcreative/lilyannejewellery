// Modules
var mongoose = require('mongoose')

// Schema
var schema = new mongoose.Schema({
    binId: String,
    locationId: String,
    memo: String
})

// Export Model
module.exports = mongoose.model('Bin', schema)
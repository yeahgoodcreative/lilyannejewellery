// Modules
var mongoose = require('mongoose')

// Schema
var schema = new mongoose.Schema({
    shipmentId: String,
    ordered: Boolean
})

// Export Model
module.exports = mongoose.model('Shipment', schema)
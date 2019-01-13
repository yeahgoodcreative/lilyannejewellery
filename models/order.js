// Modules
var mongoose = require('mongoose')

// Schema
var schema = new mongoose.Schema({
    orderId: String,
    customerId: String,
    status: String,
    orderDate: String,

    billName1: String,
    billName2: String,
    billStreet1: String,
    billStreet2: String,
    billCity: String,
    billState: String,
    billPostalCode: String,
    billCounty: String,
    billCountry: String,
    billEmail: String,
    billPhone: String,

    shipName1: String,
    shipName2: String,
    shipStreet1: String,
    shipStreet2: String,
    shipCity: String,
    shipState: String,
    shipPostalCode: String,
    shipCounty: String,
    shipCountry: String,
    shipEmail: String,
    shipPhone: String,

    invoiceNotes: String,
    shipMethodId: String,
    shipMethod: String,
    market: String,
    rankPriceType: String,
    partyId: String,
    currencyTypeId: String,
    giftOrder: String,
    alternateShipMethodId: String,

    items: [
        {
            itemId: String,
            description: String,
            quantity: String,
            price: String,
            volume: String,
            tax: String,
            taxableAmount: String
        }
    ],

    packing: {
        orderLabel: Boolean,
        items: [
            {
                itemId: String,
                ordered: Number,
                packed: Number
            }
        ],
        packSlip: Boolean,
        shippingLabel: {
            shipmentId: String,
            itemId: String,
            requestId: String
        },
        complete: Boolean
    }
})

// Export Model
module.exports = mongoose.model('Order', schema)
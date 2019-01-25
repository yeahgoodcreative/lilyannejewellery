// Modules
var mongoose = require('mongoose')

// Schema
var schema = new mongoose.Schema({
    orderId: String,
    repId: String,
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
    shipGeoCode: String,
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
            orderId: String,
            partyId: String,
            orderDetailId: String,
            itemId: String,
            description: String,
            quantity: String,
            price: String,
            volume: String,
            tax: String,
            taxableAmount: String,
            groupOwner: String,
            parentOrderDetailId: String,
            warehouseName: String,
            warehouseEmail: String,
            warehousePackSlipLine1: String,
            warehousePackSlipLine2: String,
            warehousePackSlipLine3: String,
            warehousePackSlipLine4: String,
            warehousePackSlipLine5: String,
            warehousePackSlipLine6: String,
            warehousePickupLocation: String,
            warheouseCompanyTaxId: String,
            warehouseIntlCompanyName: String,
            warehousePackSlipTaxTitle: String,
            warehousePackSlipTaxPercentage: String,
            packSlipProcessId: String,
            volume2: String,
            volume3: String,
            volume4: String,
            otherPrice1: String,
            otherPrice2: String,
            otherPrice3: String,
            otherPrice4: String,
            packSlipProductId: String,
            packSlipBarcode: String
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


var bydesignGetOrders = function() {
    // Modules
    var soap = require('soap')

    // Mongoose Models
    var Order = require('./models/order')

    // Config
    var config = require('./config')

    // Soap URL
    var url = 'https://api.securefreedom.com/lilyannedesigns/webservice/orderapi.asmx?wsdl'

    // Soap Client
    soap.createClient(url, function(err, client) {

        // Get order list recent
        client.GetOrderListRecent({
            Credentials: {
                Username: config.bydesign.username,
                Password: config.bydesign.password,
                Token: config.bydesign.token
            },
            PeriodType: config.bydesign.period_type,
            PeriodLength: config.bydesign.period_length,
            EvalDateLastModified: 'false'
        }, 
        function(err, result) {
            // Throw error
            if (err) throw err

            // Get order list from result
            var orderList = result.GetOrderListRecentResult.OrderList

            // Iterate through order list
            for (order of orderList) {
                // Create order promise
                var orderPromise = new Promise(function(resolve, reject) {
                    // Store order object in this promise
                    var currentOrder = order

                    // Create order info promise
                    var orderInfoPromise = client.GetOrderInfo_V2Async({
                        Credentials: {
                            Username: config.bydesign.username,
                            Password: config.bydesign.password,
                            Token: config.bydesign.token
                        },
                        OrderID: order.OrderID
                    })

                    // Create order details info promise
                    var orderDetailsInfoPromise = client.GetOrderDetailsInfo_V2Async({
                        Credentials: {
                            Username: config.bydesign.username,
                            Password: config.bydesign.password,
                            Token: config.bydesign.token
                        },
                        OrderID: order.OrderID
                    })

                    // Get promised data from promises
                    Promise.all([orderInfoPromise, orderDetailsInfoPromise]).then(function(results) {
                        // Get order info & order details info from result
                        var orderInfo = results[0][0].GetOrderInfo_V2Result
                        var orderDetailsInfo = results[1][0].GetOrderDetailsInfo_V2Result

                        // Resolve promise with object
                        resolve({
                            order: currentOrder,
                            orderInfo: orderInfo,
                            orderDetailsInfo: orderDetailsInfo
                        })
                    })
                })

                // Get promised data from order promise
                orderPromise.then(function(result) {

                    // console.log(result.orderDetailsInfo.OrderDetailsResponse.OrderDetailsResponseV2)

                    // Remap result
                    var order = result.order
                    var orderInfo = result.orderInfo
                    var orderDetailsInfo = result.orderDetailsInfo

                    // Create status field
                    var status = ''

                    // Set status field
                    if (orderInfo.Status == 'Entered') {
                        status = 'waiting-payment'
                    }
                    else if (orderInfo.Status == 'Posted') {
                        status = 'ready-to-pack'
                    }
                    else if (orderInfo.Status == 'Shipped') {
                        status = 'complete'
                    }
                    else if (orderInfo.Status == 'Void') {
                        status = 'void'
                    }

                    // Create items array
                    var items = []

                    // Check order details response exists
                    if (orderDetailsInfo.OrderDetailsResponse) {
                        // Iterate through items
                        for (item of orderDetailsInfo.OrderDetailsResponse.OrderDetailsResponseV2) {
                            // Push item to items array
                            items.push({
                                orderId: item.OrderID,
                                partyId: item.PartyID,
                                orderDetailId: item.OrderDetailID,
                                itemId: item.ProductID,
                                description: item.Description,
                                quantity: item.quantity,
                                price: item.Price,
                                volume: item.Volume,
                                tax: item.Tax,
                                taxableAmount: item.TaxableAmount,
                                groupOwner: item.GroupOwner,
                                parentOrderDetailId: item.ParentOrderDetailID,
                                warehouseName: item.WarehouseName,
                                warehouseEmail: item.WarehouseEmail,
                                warehousePackSlipLine1: item.WarehousePackSlipLine1,
                                warehousePackSlipLine2: item.WarehousePackSlipLine2,
                                warehousePackSlipLine3: item.WarehousePackSlipLine3,
                                warehousePackSlipLine4: item.WarehousePackSlipLine4,
                                warehousePackSlipLine5: item.WarehousePackSlipLine5,
                                warehousePackSlipLine6: item.WarehousePackSlipLine6,
                                warehousePickupLocation: item.WarehousePickupLocation,
                                warheouseCompanyTaxId: item.WarheouseCompanyTaxID,
                                warehouseIntlCompanyName: item.WarehouseIntlCompanyName,
                                warehousePackSlipTaxTitle: item.WarehousePackSlipTaxTitle,
                                warehousePackSlipTaxPercentage: item.WarehousePackSlipTaxPercentage,
                                packSlipProcessId: item.PackSlipProcessID,
                                volume2: item.Volume2,
                                volume3: item.Volume3,
                                volume4: item.Volume4,
                                otherPrice1: item.OtherPrice1,
                                otherPrice2: item.OtherPrice2,
                                otherPrice3: item.OtherPrice3,
                                otherPrice4: item.OtherPrice4,
                                packSlipProductId: item.PackSlipProcessID,
                                packSlipBarcode: item.PackSlipBarcode
                            })
                        }
                    }

                    // Create new order
                    var order = {
                        orderId: orderInfo.OrderID,
                        repId: orderInfo.RepNumber,
                        customerId: orderInfo.RepNumber,
                        status: status,
                        orderDate: orderInfo.OrderDate,

                        billName1: orderInfo.BillName1,
                        billName2: orderInfo.BillName2,
                        billStreet1: orderInfo.BillStreet1,
                        billStreet2: orderInfo.BillStreet2,
                        billCity: orderInfo.BillCity,
                        billState: orderInfo.BillState,
                        billPostalCode: orderInfo.BillPostalCode,
                        billCounty: orderInfo.BillCounty,
                        billCountry: orderInfo.BillCountry,
                        billEmail: orderInfo.BillEmail,
                        billPhone: orderInfo.BillPhone,

                        shipName1: orderInfo.ShipName1,
                        shipName2: orderInfo.ShipName2,
                        shipStreet1: orderInfo.ShipStreet1,
                        shipStreet2: orderInfo.ShipStreet2,
                        shipCity: orderInfo.ShipCity,
                        shipState: orderInfo.ShipState,
                        shipPostalCode: orderInfo.ShipPostalCode,
                        shipGeoCode: orderInfo.ShipGeoCode,
                        shipCounty: orderInfo.ShipCounty,
                        shipCountry: orderInfo.ShipCountry,
                        shipEmail: orderInfo.ShipEmail,
                        shipPhone: orderInfo.ShipPhone,

                        invoiceNotes: orderInfo.InvoiceNotes,
                        shipMethodId: orderInfo.ShipMethodID,
                        shipMethod: orderInfo.ShipMethod,
                        market: orderInfo.Market,
                        rankPriceType: orderInfo.RankPriceType,
                        partyId: orderInfo.PartyID,
                        currencyTypeId: orderInfo.CurrencyTypeID,
                        giftOrder: orderInfo.GiftOrder,
                        alternateShipMethodId: orderInfo.AlternateShipMethodID,

                        items: items
                    }

                    Order.findOneAndUpdate({orderId: orderInfo.OrderID}, order, {upsert: true}, function(err, order) {
                        // Throw error
                        if (err) throw err
                    })
                })
            }

        })

    })
}

module.exports = bydesignGetOrders
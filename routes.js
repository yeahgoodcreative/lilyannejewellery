var routes = function(io) {
    // Modules
    var express = require('express')
    var Router = express.Router

    var PDFDocument = require('pdfkit')
    var barcode = require('jsbarcode')

    // Mongoose Models
    var Order = require('./models/order')
    var Item = require('./models/item')
    var Bin = require('./models/bin')
    var Location = require('./models/location')

    // Config
    var config = require('./config')

    // AusPost
    var auspostGetItemPrices = require('./auspostGetItemPrices')
    var auspostCreateShipments = require('./auspostCreateShipments')
    var auspostCreateLabels = require('./auspostCreateLabels')
    var auspostGetLabels = require('./auspostGetLabels')

    // Instantiate router
    var router = new Router()

    // Routes
    router.get('/', function(req, res) {
        res.redirect('/orders')
    })

    router.get('/orders', function(req, res) {
        res.render('orders', {})
    })

    router.get('/orders/orderlabel', function(req, res) {
        // Update order packing status
        Order.findOne({orderId: req.query.orderid}, 'packing', function(err, order) {
            if (err) throw err

            var packing = order.packing
            packing.orderLabel = true

            Order.findOneAndUpdate({orderId: req.query.orderid}, {packing: packing}, function(err, order) {
                // Throw error
                if (err) throw err
            })
        })

        // Set response content type
        res.contentType('application/pdf')

        // Get date
        var today = new Date()
        var day = today.getDate()
        var month = today.getMonth() + 1
        var year = today.getFullYear()

        var date = day + '/' + month + '/' + year

        // PDF document setup
        var doc = new PDFDocument({size: [3*72, 2*72], margin: 16})
        doc.pipe(res)

        // Set font size
        doc.fontSize(16)

        // Bill to block
        doc.font('./public/fonts/Roboto/Roboto-Medium.ttf')
        doc.text('Order ID: ' + req.query.orderid, {width: 3*72-32, align: 'center'})
        doc.font('./public/fonts/Roboto/Roboto-Regular.ttf')
        doc.text('Date: ' + date, {width: 3*72-32, align: 'center'})

        // Create barcode data object
        var barcodeData = {}

        // Generate new barcode
        barcode(barcodeData, req.query.orderid, {
            format: 'code128',
            width: 2,
            height: 50,
            displayValue: false
        })
        
        // Remap barcode data values
        var text = barcodeData.encodings[0].text
        var binary = barcodeData.encodings[0].data
        var options = barcodeData.encodings[0].options

        // Iterate through binary
        for (var b = 0; b < binary.length; b++) {

            // Set x position
            var x = b * options.width + ((3*72) - binary.length * options.width ) / 2
            var y = (2*72) / 2

            if (binary[b] == '1') {
                // Draw black rectangle
                doc.fillColor('#000000')
                doc.rect(x, y, options.width, options.height).fill()
            }
            else if (binary[b] == '0') {
                // Draw white rectangle
                doc.fillColor('#ffffff')
                doc.rect(x, y, options.width, options.height).fill()
            }
        }


        // End document
        doc.end()
    })

    router.get('/orders/packslip', function(req, res) {
        // Update order packing status
        Order.findOne({orderId: req.query.orderid}, 'packing', function(err, order) {
            if (err) throw err

            var packing = order.packing
            packing.packSlip = true

            Order.findOneAndUpdate({orderId: req.query.orderid}, {packing: packing}, function(err, order) {
                // Throw error
                if (err) throw err
            })
        })


        // Set response content type
        res.contentType('application/pdf')

        // Find order in database
        Order.findOne({orderId: req.query.orderid}).exec(function(err, order) {

            // PDF document setup
            var doc = new PDFDocument({size: [3.14961*72, 11.6929*72], margin: 14.1732})
            doc.pipe(res)

            // Insert image
            doc.image('./public/img/lilyannejewellery-logo.png', (3.14961-1.5)/2*72, 20, {width: 1.5*72})

            // Set font size
            doc.fontSize(8)

            // Order id block
            doc.font('./public/fonts/Roboto/Roboto-Medium.ttf')
            doc.text('Order ID: ' + order.orderId, 15, 90)

            // Spacer
            doc.text(' ')

            // Bill to block
            doc.font('./public/fonts/Roboto/Roboto-Medium.ttf')
            doc.text('Bill To:')
            doc.font('./public/fonts/Roboto/Roboto-Regular.ttf')
            doc.text(order.billName1)
            doc.text(order.billStreet1)
            doc.text(order.billCity + ', ' + order.billState + ' ' + order.billPostalCode)
            doc.text(order.billCountry)

            // Spacer
            doc.text(' ')

            // Ship to block
            doc.font('./public/fonts/Roboto/Roboto-Medium.ttf')
            doc.text('Ship To:')
            doc.font('./public/fonts/Roboto/Roboto-Regular.ttf')
            doc.text(order.shipName1)
            doc.text(order.shipStreet1)
            doc.text(order.shipCity + ', ' + order.shipState + ' ' + order.shipPostalCode)
            doc.text(order.shipCountry)

            // Spacer
            doc.text(' ')
            doc.text(' ')
            doc.text(' ')

            // Iterate through items
            for (item of order.items) {
                var itemPacked = 0

                for (packedItem of order.packing.items) {
                    if (packedItem.itemId == item.itemId) {
                        itemPacked = packedItem.packed
                    }
                }

                // Line items block
                doc.font('./public/fonts/Roboto/Roboto-Medium.ttf')
                doc.text(item.itemId + ' - ' + item.description)
                doc.font('./public/fonts/Roboto/Roboto-Regular.ttf')
                doc.text('Qty Ordered:' + item.quantity)
                doc.text('Qty Packed: ' + itemPacked)
                doc.text(' ')
            }

            // End document
            doc.end()
        })
    })

    router.get('/orders/shippinglabel', function(req, res) {
        Order.findOne({orderId: req.query.orderid}, 'packing', function(err, order) {
            if (err) throw err

            auspostGetLabels(order.packing.shippingLabel.requestId, function(data) {

                res.redirect(data.labels[0].url)
            })
        })
    })

    router.get('/orders/pack/1', function(req, res) {
        res.render('orders-pack1', {orderId: req.query.orderid, printer: config.print.orderlabel_printer})
    })

    router.get('/orders/pack/2', function(req, res) {
        res.render('orders-pack2', {orderId: req.query.orderid})
    })

    router.get('/orders/pack/3', function(req, res) {
        var length = config.auspost.default_length
        var width = config.auspost.default_width
        var height = config.auspost.default_height
        var weight = config.auspost.default_weight

        res.render('orders-pack3', {orderId: req.query.orderid, length: length, width: width, height: height, weight: weight})
    })

    router.post('/orders/pack/3', function(req, res) {
        // Update order packing status
        Order.findOne({orderId: req.body.orderId}, '', function(err, order) {
            if (err) throw err

            auspostGetItemPrices({
                from: {
                    postcode: config.auspost.from.postcode,
                },
                to: {
                    postcode: order.shipPostalCode
                },
                items: [
                    {
                        length: req.body.length,
                        width: req.body.width,
                        height: req.body.height,
                        weight: req.body.weight
                    }
                ]
            },
            function(data) {

                for (price of data.items[0].prices) {

                    if (price.product_type == config.auspost.product_type) {
                        var productId = price.product_id

                        var state = ''

                        if (order.shipState.toUpperCase() == 'VICTORIA') {
                            state = 'VIC'
                        }
                        else if (order.shipState.toUpperCase() == 'NORTHERN TERRITORY') {
                            state = 'NT'
                        }
                        else if (order.shipState.toUpperCase() == 'WESTERN AUSTRALIA') {
                            state = 'WA'
                        }
                        else if (order.shipState.toUpperCase() == 'AUSTRALIAN CAPITAL TERRITORY') {
                            state = 'ACT'
                        }
                        else if (order.shipState.toUpperCase() == 'QUEENSLAND') {
                            state = 'QLD'
                        }
                        else if (order.shipState.toUpperCase() == 'TASMANIA') {
                            state = 'TAS'
                        }
                        else if (order.shipState.toUpperCase() == 'SOUTH AUSTRALIA') {
                            state = 'SA'
                        }
                        else if (order.shipState.toUpperCase() == 'NEW SOUTH WALES') {
                            state = 'NSW'
                        }
                        else {
                            state = order.shipState.toUpperCase()
                        }

                        auspostCreateShipments({
                            shipments: [
                                {
                                    shipment_reference: order.orderId,
                                    email_tracking_enabled: true,
                                    from: config.auspost.from,
                                    to: {
                                        name: order.shipName1,
                                        lines: [
                                            order.shipStreet1
                                        ],
                                        suburb: order.shipCity,
                                        state: state,
                                        postcode: order.shipPostalCode,
                                        email: order.shipEmail,
                                        phone: order.shipPhone
                                    },
                                    items: [
                                        {
                                            product_id: productId,
                                            length: req.body.length,
                                            width: req.body.width,
                                            height: req.body.height,
                                            weight: req.body.weight,
                                            authority_to_leave: false,
                                            allow_partial_delivery: false
                                        }
                                    ]
                                }
                            ]
                        },
                        function(data) {

                            var shipmentId = data.shipments[0].shipment_id
                            var itemId = data.shipments[0].items[0].item_id

                            auspostCreateLabels({
                                preferences: [
                                    {
                                        type: 'PRINT',
                                        format: 'PDF',
                                        groups: [
                                            {
                                                group: 'Parcel Post',
                                                layout: config.auspost.print_layout,
                                                branded: true,
                                                left_offset: 2,
                                                top_offset: 0
                                            }
                                        ]
                                    }
                                ],
                                shipments: [
                                    {
                                        shipment_id: shipmentId,
                                        items: [
                                            {
                                                item_id: itemId
                                            }
                                        ]
                                    }
                                ]
                            },
                            function(data) {
                                var requestId = data.labels[0].request_id

                                // Update order packing status
                                Order.findOne({orderId: req.body.orderId}, 'packing', function(err, order) {
                                    if (err) throw err

                                    var packing = order.packing
                                    packing.shippingLabel = {shipmentId: shipmentId, itemId: itemId, requestId: requestId}

                                    Order.findOneAndUpdate({orderId: req.body.orderId}, {packing: packing}, function(err, order) {
                                        // Throw error
                                        if (err) throw err

                                        res.json({
                                            success: true
                                        })
                                    })
                                })
                            })
                        })
                    }
                }
            })
        })
    })

    router.get('/orders/pack/4', function(req, res) {
        res.render('orders-pack4', {orderId: req.query.orderid, printer: config.print.packslip_printer})
    })

    router.get('/orders/pack/5', function(req, res) {
        res.render('orders-pack5', {orderId: req.query.orderid, printer: config.print.shippinglabel_printer})
    })

    router.post('/orders/pack/scan', function(req, res) {

        var orderId = req.body['orderId']
        var items = req.body['items']

        var packingItems = []

        for (item of items) {
            packingItems.push({
                itemId: item.itemId,
                ordered: item.quantity,
                packed: item.picked
            })
        }

        // Update order packing status
        Order.findOne({orderId: orderId}, 'packing', function(err, order) {
            if (err) throw err

            var packing = order.packing
            packing.items = packingItems

            Order.findOneAndUpdate({orderId: orderId}, {packing: packing}, function(err, order) {
                // Throw error
                if (err) throw err

                // Emit all orders
                io.emit('orders/pack', {
                    type: 'status',
                    orderId: orderId,
                    status: 'order-packed'
                })

                res.redirect('/scanner')
            })
        })
    })

    router.get('/orders/pack/complete', function(req, res) {
        // Update order packing status
        Order.findOne({orderId: req.query.orderid}, 'packing', function(err, order) {
            if (err) throw err

            var packing = order.packing
            packing.complete = true

            Order.findOneAndUpdate({orderId: req.query.orderid}, {packing: packing}, function(err, order) {
                // Throw error
                if (err) throw err

                // Set status shipped
                bydesignSetStatusShipped(order.orderId)

                // Redirect
                res.redirect('/orders')
            })
        })
    })

    router.get('/inventory/items', function(req, res) {
        res.render('inventory-items', {})
    })

    router.get('/inventory/bins', function(req, res) {
        res.render('inventory-bins', {})
    })

    router.get('/inventory/locations', function(req, res) {
        res.render('inventory-locations', {})
    })

    // Scanner Routes
    router.get('/scanner', function(req, res) {
        res.render('scanner/index', {})
    })

    router.get('/scanner/sales-order-picking1', function(req, res) {
        res.render('scanner/sales-order-picking1', {})
    })

    router.post('/scanner/sales-order-picking2', function(req, res) {
        // Store order number from body
        var orderNumber = req.body['sales-order-number']

        // Get order info from order number
        Order.findOne({orderId: orderNumber}, function(err, order) {
            // Throw error
            if (err) throw err

            var itemPromises = []

            for (item of order.items) {
                itemPromises.push(Item.findOne({itemId: item.itemId}))
            }

            Promise.all(itemPromises).then(function(results) {
                for (result of results) {
                    if (result) {

                        for (var [index, item] of order.items.entries()) {
                            if (result.itemId == item.itemId) {
                                order.items[index].binId = result.binId
                            }
                        }
                    }
                }

                order.items.sort(function(a, b) {
                    if (a.binId && b.binId) {
                        var binA = a.binId.toUpperCase()
                        var binB = b.binId.toUpperCase()

                        if (binA < binB) {
                            return -1
                        }
                        else if (binA > binB) {
                            return 1
                        }
                        else {
                            return 0
                        }
                    }
                    else if (!a.binId) {
                        return 1
                    }
                    else if (!b.binId) {
                        return -1
                    }
                    else {
                        return 0
                    }
                })
    
                // Render view
                res.render('scanner/sales-order-picking2', {"orderId": order.orderId, "orderDetails": order.items})
            })
        })
    })

    return router
}

// Export router
module.exports = routes
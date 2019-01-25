
// Create function
var sockets = function(io) {
    // Mongoose Models
    var Order = require('./models/order')
    var Item = require('./models/item')
    var Bin = require('./models/bin')
    var Location = require('./models/location')
    var Shipment = require('./models/shipment')

    // Config
    var config = require('./config')

    // Socket.IO
    io.on('connection', function(socket) {

        // EVENT: Orders
        socket.on('orders', function(req) {
            // Requested all
            if (req.get == 'all') {

                // Get orders from database
                Order.find({}, 'orderId orderDate billName1 status packing', {sort: {orderId: -1}}, function (err, orders) {
                    // Throw error
                    if (err) throw err

                    // Emit all orders
                    socket.emit('orders', {
                        type: 'all',
                        orders: orders
                    })
                })
            }
        })

        setInterval(function() {
            // Get orders from database
            Order.find({}, 'orderId orderDate billName1 status packing', {sort: {orderId: -1}}, function (err, orders) {
                // Throw error
                if (err) throw err

                // Emit all orders
                socket.emit('orders', {
                    type: 'all',
                    orders: orders
                })
            })
        }, config.bydesign.refresh_rate)

        // EVENT: Inventory Items
        socket.on('inventory/items', function(req) {
            // Requested all
            if (req.get == 'all') {

                // Get items from database
                Item.find({}, 'itemId description locationId binId', {sort: {binId: 1}}, function (err, items) {

                    // Emit all orders
                    socket.emit('inventory/items', {
                        type: 'all',
                        items: items
                    })
                })
            }
        })

        // EVENT: Inventory Bins
        socket.on('inventory/bins', function(req) {
            // Requested all
            if (req.get == 'all') {

                // Get items from database
                Bin.find({}, 'binId locationId memo', {sort: {binId: 1}}, function (err, bins) {

                    // Emit all orders
                    socket.emit('inventory/bins', {
                        type: 'all',
                        bins: bins
                    })
                })
            }
        })

        // EVENT: Inventory Locations
        socket.on('inventory/locations', function(req) {
            // Requested all
            if (req.get == 'all') {

                // Get items from database
                Location.find({}, 'locationId', {sort: {locationId: 1}}, function (err, locations) {

                    // Emit all orders
                    socket.emit('inventory/locations', {
                        type: 'all',
                        locations: locations
                    })

                })
            }
        })

        // EVENT: Inventory Locations
        socket.on('orders/pack', function(req) {
            
        })

        // EVENT: AusPost Shipments
        socket.on('auspost/shipments', function(req) {
            // Requested all
            if (req.get == 'order') {

                // Get shipments from database
                Shipment.find({ordered: {$eq: false}}, 'shipmentId', {}, function (err, shipments) {

                    // Emit order shipments
                    socket.emit('auspost/shipments', {
                        type: 'order',
                        shipments: shipments
                    })
                })
            }
        })
    })
}

// Export function
module.exports = sockets
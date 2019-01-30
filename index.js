// Modules
var express = require('express')
var app = express()
var Router = express.Router
var bodyParser = require('body-parser')

var http = require('http').Server(app)
var io = require('socket.io')(http)

var mustache = require('mustache-express')
var mongoose = require('mongoose')

// Config
var config = require('./config')

// Models
var Order = require('./models/order')
var Item = require('./models/item')
var Bin = require('./models/bin')
var Location = require('./models/location')

// ByDesign
var bydesignGetOrders = require('./bydesignGetOrders')
var bydesignGetParty = require('./bydesignGetParty')
var bydesignSetStatusShipped = require('./bydesignSetStatusShipped')

// AusPost
var auspostGetItemPrices = require('./auspostGetItemPrices')
var auspostCreateShipments = require('./auspostCreateShipments')
var auspostCreateLabels = require('./auspostCreateLabels')
var auspostGetLabels = require('./auspostGetLabels')
var auspostGetAccounts = require('./auspostGetAccounts')

// Routers
var routes = require('./routes')

// Sockets
var sockets = require('./sockets')

// Mongoose
mongoose.connect('mongodb://localhost:27017/' + config.mongodb.database, {useNewUrlParser: true, authSource: config.mongodb.auth_source, user: config.mongodb.username, pass: config.mongodb.password})

mongoose.connection.on('error', function(err) {
    if (err) throw err
})

mongoose.connection.once('open', function() {
    // Express Config
    app.engine('mustache', mustache())

    app.set('view engine', 'mustache')
    app.set('views', __dirname + '/views')

    app.use(express.static('public'))

    // Express Body Parser Config
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: true }))

    // Routers
    app.use('/', routes(io))

    // Sockets
    sockets(io)

    // Process bydesign orders
    bydesignGetOrders()
    setInterval(bydesignGetOrders, config.bydesign.refresh_rate)
    // bydesignOrders()
    // bydesignGetParty()

    // Per order
    // 1. Create shipment
    // 2. Create labels
    // 3. Get labels

    // Per day
    // 4. Create order
    // 5. Print order summary
    // 6. Order summary



    // Server Listener
    http.listen('8080', function() {
        console.log('[INFO] Server listening on localhost:8080.')
    })
})
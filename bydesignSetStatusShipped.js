

var bydesignSetStatusShipped = function(orderId) {
    // Modules
    var soap = require('soap')

    // Config
    var config = require('./config')

    // Soap URL
    var url = 'https://api.securefreedom.com/lilyannedesigns/webservice/orderapi.asmx?wsdl'

    // Soap Client
    soap.createClient(url, function(err, client) {

        // Get order list recent
        client.SetStatusShipped({
            Credentials: {
                Username: config.bydesign.username,
                Password: config.bydesign.password,
                Token: config.bydesign.token
            },
            OrderID: orderId
        }, 
        function(err, result) {
            // Throw error
            if (err) throw err

            console.log('[INFO] Order set status complete for ' + orderId)

        })
    })
}

module.exports = bydesignSetStatusShipped
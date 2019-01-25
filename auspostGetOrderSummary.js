
var auspostGetOrderSummary = function(orderNumber, callback) {
    // Modules
    var https = require('https')
    var fs = require('fs')

    // Config
    var config = require('./config')

    // Credentials
    var credentials = {
        apiKey: config.auspost.api_key,
        accountNumber: config.auspost.account_number,
        password: config.auspost.password
    }

    // Encode credentials
    var auth = Buffer.from(credentials.apiKey + ':' + credentials.password).toString('base64')

    // Request options
    var options = {
        hostname: 'digitalapi.auspost.com.au',
        path: '/test/shipping/v1/accounts/' + credentials.accountNumber + '/orders/' + orderNumber + '/summary',
        port: 443,

        method: 'GET',
        headers: {
            'Account-Number': credentials.accountNumber,
            'Authorization': 'Basic ' + auth,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    }

    // Create new request
    var req = https.request(options, function(res) {

        // // Create body buffer string
        // var bodyBuffer = ''

        // // EVENT: Data
        // res.on('data', function(body) {
        //     // Append body to body buffer
        //     bodyBuffer += body
        // })

        // // EVENT: End
        // res.on('end', function() {
        //     // Callback with response json
        //     callback(bodyBuffer.toString())
        // })

        callback(res)
    })

    // Write data to request & end
    req.write('')
    req.end()
}

// Export module
module.exports = auspostGetOrderSummary
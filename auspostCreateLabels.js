
var auspostCreateLabels = function(data, callback) {
    // Modules
    var https = require('https')

    // Config
    var config = require('./config')

    // Credentials
    var credentials = {
        apiKey: config.auspost.api_key,
        accountNumber: config.auspost.account_number,
        password: config.auspost.password
    }

    // Convert json to string
    var data = JSON.stringify(data)

    // Encode credentials
    var auth = Buffer.from(credentials.apiKey + ':' + credentials.password).toString('base64')

    // Request options
    var options = {
        hostname: 'digitalapi.auspost.com.au',
        path: '/test/shipping/v1/labels',
        port: 443,

        method: 'POST',
        headers: {
            'Account-Number': credentials.accountNumber,
            'Authorization': 'Basic ' + auth,
            'Content-Type': 'application/json'
        }
    }

    // Create new request
    var req = https.request(options, function(res) {

        // Create body buffer string
        var bodyBuffer = ''

        // EVENT: Data
        res.on('data', function(body) {
            // Append body to body buffer
            bodyBuffer += body
        })

        // EVENT: End
        res.on('end', function() {
            // Callback with response json
            callback(JSON.parse(bodyBuffer.toString()))
        })
    })

    // Write data to request & end
    req.write(data)
    req.end()
}

// Export module
module.exports = auspostCreateLabels
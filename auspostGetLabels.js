
var auspostGetLabels = function(requestId, callback) {
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

    // Encode credentials
    var auth = Buffer.from(credentials.apiKey + ':' + credentials.password).toString('base64')

    // Request options
    var options = {
        hostname: 'digitalapi.auspost.com.au',
        path: '/test/shipping/v1/labels/' + requestId,
        port: 443,

        method: 'GET',
        headers: {
            'Account-Number': credentials.accountNumber,
            'Authorization': 'Basic ' + auth,
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
    req.write('')
    req.end()
}

// Export module
module.exports = auspostGetLabels
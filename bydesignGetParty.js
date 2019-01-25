

var bydesignGetParty = function() {
    // Modules
    var soap = require('soap')

    // Mongoose Models
    var Order = require('./models/order')

    // Config
    var config = require('./config')

    // Soap URL
    var url = 'https://api.securefreedom.com/lilyannedesigns/webservice/partyapi.asmx?wsdl'

    // Soap Client
    soap.createClient(url, function(err, client) {

        // Get order list recent
        client.GetParty_v2({
            Credentials: {
                Username: config.bydesign.username,
                Password: config.bydesign.password,
                Token: config.bydesign.token
            },
            PartyID: '25328' 
        }, 
        function(err, result) {
            // Throw error
            if (err) throw err


            console.log(result)
        })
    })
}

module.exports = bydesignGetParty
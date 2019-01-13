var parse = require('csv-parse')
var generate = require('csv-generate')
var fs = require('fs')

var csv = fs.readFileSync('./inventory.csv').toString()

parse(csv, {

},
function(err, rows) {
    if (err) throw err

    var itemcodes = []

    for (var [index, row] of rows.entries()) {
        
        var displayName = row[0]
        var preferredLocation = row[1]
        var binNumber = row[2]
        var item = row[3]
        var count = row[4]

        if (index > 0) {
            if (binNumber != 'BeautyPackaging' && binNumber != 'Broken' && binNumber != 'Dispatch' && binNumber != 'Picked-1' && binNumber != 'Picked-1--5' && binNumber != 'Picked-1-1139184' && binNumber != 'Picked-1-1191991' && binNumber != 'Picked-1-19' && binNumber != 'Picked-1-20' && binNumber != 'Picked-1-20-Broken' && binNumber != 'Picked-1-35962' && binNumber != 'Picked-1-Old' && binNumber != 'Picked-6' && binNumber != 'Picked-6-19' && binNumber != 'Picked-6-19-Old' && binNumber != 'Picked-6-20' && binNumber != 'Picked-6-35962' && binNumber != 'PR-A1' && binNumber != 'PR-A2' && binNumber != 'PR-A3' && binNumber != 'PR-A4' && binNumber != 'PR-A5' && binNumber != 'PR-B1' && binNumber != 'PR-B2' && binNumber != 'PR-B3' && binNumber != 'PR-B4' && binNumber != 'PR-B5' && binNumber != 'PR-C1' && binNumber != 'PR-C2' && binNumber != 'PR-C3' && binNumber != 'PR-C4' && binNumber != 'PR-C5' && binNumber != 'PR-D1' && binNumber != 'PR-D2' && binNumber != 'PR-D3' && binNumber != 'PR-D4' && binNumber != 'PR-D5' && binNumber != 'PR-E2' && binNumber != 'PR-E3' && binNumber != 'PR-E4' && binNumber != 'PR-E5' && binNumber != 'QA' && binNumber != 'Temp-Receipt-Bin' && binNumber != 'VW-A1-1A' && binNumber != 'VW-A1-1A-6-6' && binNumber != 'VW-A1-1B' && binNumber != 'VW-A1-1B-6' && binNumber != 'VW-A1-1C' && binNumber != 'VW-A1-1C-6' && binNumber != 'VW-A1-1D' && binNumber != 'VW-A1-1D-6' && binNumber != 'VW-A1-1E' && binNumber != 'VW-A1-1E-6' && binNumber != 'VW-A1-1F' && binNumber != 'VW-A1-1F-6' && binNumber != 'VW-A1-1G' && binNumber != 'VW-A1-1G-6' && binNumber != 'VW-A1-1H' && binNumber != 'VW-A1-1H-6' && binNumber != 'VW-A1-1I-6' && binNumber != 'VW-A1-1J' && binNumber != 'VW-A1-1J-6' && binNumber != 'VW-A1-1K' && binNumber != 'VW-A1-1K-6' && binNumber != 'VW-A1-2A' && binNumber != 'VW-A1-2A-6' && binNumber != 'VW-A1-2B' && binNumber != 'VW-A1-2B-6' && binNumber != 'VW-A1-2C' && binNumber != 'VW-A1-2C-6') {
                if (count > 0) {
                    var dupe = false

                    for (itemcode of itemcodes) {
                        if (item == itemcode) {
                            dupe = true
                            break
                        }
                    }

                    if (dupe == false) {
                        itemcodes.push(item)
                        
                        var item = new Item({
                            itemId: item,
                            description: displayName,
                            locationId: preferredLocation,
                            binId: binNumber,
                            count: count
                        })

                        item.save(function(err, item) {
                            if (err) throw err

                            console.log('Item Saved')
                        })
                    }
                    else {
                        console.log('Duplicate found')
                    }
                }
                else {
                    console.log('Count is zero')
                }
            }
            else {
                console.log('Bin is forbidden')
            }
        }

        
    }
})
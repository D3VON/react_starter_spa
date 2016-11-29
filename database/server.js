'use strict'
/**
 * Immitating a database.
 * I think it would have been easier for me to actually set up a database
 * than to use Clay's module.
***/
/*
Server is acting like a database.  db.js is acting like asynchronous database
response.  Therefore this server must use a promise to wait for the response
from db.js. Likewise, the script that uses this pseudo database must use a
promise to wait for the entire response.
*/
var theSequence = ''
const db = require('./db.js')
const http = require('http')

var callbk = function (err, delay) {
  console.log('err is: ' + JSON.stringify(err))
  console.log('delay is: ' + JSON.stringify(delay))
  if (err !== null) {
    this.callbk_result = ''
    console.log(err)
  } else {
    console.log('The sequence ' + theSequence + ' took ' + delay + ' to save.')
  }
}

const server = http.createServer(function (req, res) {
  req.on('data', function (data) { // receive incoming sequence
    var json = JSON.parse(data)
    theSequence = json.sequence
    console.log("db server.js rec'd req string: " + theSequence)

    // db.js function will pause
    db.store(theSequence, callbk)
  })
  req.on('end', function () { // finish receiving incoming sequence

    res.writeHead(200, {'Content-Type': 'text/plain'})
    res.end()
  })
})
server.listen(5959, function () {
  console.log('Aye aye, Captain!')
})

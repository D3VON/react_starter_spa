'use strict'
const Q = require('q') // promise library
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
  var incomingJsonString = ''
  req.on('data', function (data) { // receive incoming sequence
    incomingJsonString += data
  })
  req.on('end', function () { // finish receiving incoming sequence
    var json = JSON.parse(incomingJsonString)
    theSequence = json.sequence
  // console.log("db server.js rec'd req string: " + theSequence)
    let result = theSequence
    // Make a get request to fake db function
    // get request because it is in reality just reading, not updating anything.
    // db.js function will pause, therefore a promise is needed to receive response
    Q.fcall(db.store(theSequence, callbk)) // promisedStep1
    // THERE JUST DOESN'T SEEM TO BE ANYTHING RETURNED ¯\_(ツ)_/¯
    // .then(function () {
    //   result = 'The sequence ' + theSequence + ' was saved.'
    //   console.log('RESPONSE IN THE FAKE DB SERVER: ')
    // })
    .catch(function (error) {
      console.log(error)
      res.writeHead(404, {'Content-Type': 'text/plain'})
      res.end('failure to write to db')
    })
    .done()

    res.writeHead(200, {'Content-Type': 'text/plain'})
    res.end(result)
  })
})
server.listen(5959, function () {
  console.log('Aye aye, Captain!')
})

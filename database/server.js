'use strict'
/*
Server is acting like a database.  db.js is acting like asynchronous database
response (that is: it's slow). We want to wait until it returns before
alerting the client that it succeeded. So, embed the response in the
callback we send to the db.
*/
var theSequence = ''
const db = require('./db.js')
const http = require('http')

const server = http.createServer(function (req, res) {
  req.on('error', function (err) {
    console.error(err)
  })
  req.on('data', function (data) { // receive incoming sequence
    var json = JSON.parse(data)
    theSequence = json.sequence
    console.log("db server.js rec'd req string: " + theSequence)
  })
  req.on('end', function () { // finished receiving incoming sequence
    res.writeHead(200)
    db.store(theSequence, function (err, id) {
      if (err !== null) {
        console.log(err)
      } else {
        console.log('The sequence ' + theSequence + ' was saved with ID #' + id)
      }
      /* REVELATION: embed the response within my db.store-callback! */
      res.write('Saved to db.js!')
      res.end()
    })
  })
})
server.listen(5959, function () {
  console.log('Aye aye, Captain!')
})

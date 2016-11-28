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
    // axios.get(db.store(theSequence, callbk))
    // let deferred = Q.defer()
    // deferred.resolve(db.store(theSequence, callbk))
    // deferred.promise.then(function (args) {
    //   console.log('RESPONSE IN THE FAKE DB SERVER: ' + JSON.stringify(args))
      //   let dbResult = args[0], body = args[1];
      //   res.json(dbResult.statusCode, body);
      // }, function(err) {
      //   res.json(502, { error: "bad_gateway", reason: err.code });
      // })
      // response => this.setState({ messages: response.data })
      // console.log('RESPONSE IN THE FAKE DB SERVER: ' + JSON.stringify(response))
    Q.fcall(db.store(theSequence, callbk)) // promisedStep1
    // THERE JUST DOESN'T SEEM TO BE ANYTHING RETURNED ¯\_(ツ)_/¯
    // .then(function () {
    //   result = 'The sequence ' + theSequence + ' was saved.'
    //   console.log('RESPONSE IN THE FAKE DB SERVER: ')
    // })
    .catch(function (error) {
      // Handle any error from all above steps
      console.log(error)
      res.writeHead(404, {'Content-Type': 'text/plain'})
      res.end('failure to write to db')
    })
    .done()

    // result = JSON.stringify(args)
    res.writeHead(200, {'Content-Type': 'text/plain'})
    res.end(result)
  })
})
// })
server.listen(5959, function () {
  console.log('Aye aye, Captain!')
})

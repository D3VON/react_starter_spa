'use strict'
const Q = require('q')
const request = require('request')

module.exports = function (sequencedb, app) {
  function isAlpha (str) {
    return /^[A-Z]+$/.test(str)
  }

  /* sequence pairs are hard-coded into this function. */
  function validateInput (s) {
    let result = {}
    result.sequence = s
    // check if safe user input
    if (!isAlpha(s)) {
      result.verdict = 'improper input, cannot check, please enter again'
    }

    var i = 0
    var j = 1
    const pairs = {'P': 'A',
                   'N': 'Y',
                   'O': 'H',
                   'W': 'V'
                  }

    while (i < s.length && i > -1 && j < s.length) {
      if (pairs[s.charAt(i)] === s.charAt(j)) {
        // found a growing core
        i -= 1
        j += 1
      } else {
        i += 1
        j += 1
      }
    }
    if (i === -1 && j === s.length) {
      result.verdict = '1'
    } else {
      result.verdict = 'false'
    }

    /*
      example results:
      {"sequence":"WNYV","verdict":"1"}
          verdict of "1" means it passed
      {"sequence":"WNYVs","verdict":"improper input, cannot check, please enter again"}
          's' is an invalid letter, so, it failed badly
      {"sequence":"WNYVPA","verdict":"false"}
          all letters are valid, but sequence fails
     */
    return result
  }

  /**
   * 'store' the specified sequence into the fake db
   * curl -X PUT http://localhost:3000/api/sequencedb/PNYe
   */
  app.put('/api/store_sequence/:seq', function (req, res) {
    let result = {}
    result = validateInput(req.params.seq)
    console.log('result of validateInput(): ' + JSON.stringify(result))
    if (result.verdict === '1') { // input is valid, send to db
      let deferred = Q.defer()
      request.put({
        url: sequencedb,
        // body: req.params.seq
        json: { 'sequence': req.params.seq }
      }, function (err, dbRes, body) {
        if (err) {
          deferred.reject(err)
        } else {
          // beautiful output to server console.
          console.log('deferred.resolve( dbRes & body ) is: \n' + JSON.stringify(dbRes) + '\n======\n' + JSON.stringify(body))
          deferred.resolve([dbRes, body])
        }
      })

      deferred.promise.then(function (args) {
        let dbRes = args[0]
        let body = args[1]
        // deprecated res.json(statusCode, body)
        res.status(dbRes.statusCode).json(body)
      }, function (err) {
        // deprecated res.json(404, { error: "Fake database server isn't running. ", reason: err.code })
        res.status(404).json({ error: "Fake database server isn't running. ", reason: err.code })
      })
    } else {
      res.status(200).json(result)
      // I marked it as success for the browser, but, will use result to discover failure
    }
  })

  // this route provided for testing validation algorithm
  app.get('/api/store_sequence/:view', function (req, res) {
    let result = {}
    result = validateInput(req.params.view)
    res.json(result)
  })
}

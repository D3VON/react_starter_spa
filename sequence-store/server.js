var path = require('path')
var express = require('express')
var app = express()
const request = require('request')
var favicon = require('serve-favicon')
app.use(favicon(__dirname + '/favicon.ico'))
var PORT = process.env.PORT || 8888
const sequencedb = 'http://localhost:5959/' // fake db server at 5959

// using webpack-dev-server and middleware in development environment
if (process.env.NODE_ENV !== 'production') {
  var webpackDevMiddleware = require('webpack-dev-middleware')
  var webpackHotMiddleware = require('webpack-hot-middleware')
  var webpack = require('webpack')
  var config = require('./webpack.config')
  var compiler = webpack(config)

  app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }))
  app.use(webpackHotMiddleware(compiler))
}

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
 * store the specified sequence
 * curl -X PUT http://localhost:3000/api/sequencedb/PNYe
 */
app.put('/api/store_sequence/:seq', function (req, res) {
  let result = {}
  result = validateInput(req.params.seq)
  console.log('result of validateInput(): ' + JSON.stringify(result))
  if (result.verdict === '1') { // input is valid, send to db
    request.put({
      url: sequencedb,
      // body: req.params.seq
      json: { 'sequence': req.params.seq }
    }, function (err, gotThisStuffBack) {
      if (err) {
        console.log('there was an error' + err)
        res.status(404).json({ error: "Fake database server isn't running. ", reason: err.code })
      } else {
        // beautiful output to server console.
        console.log('got this stuff back from put request to server: \n' + JSON.stringify(gotThisStuffBack))
        res.status(gotThisStuffBack.statusCode).json(gotThisStuffBack.body)
      }
    })
  } else {
    res.status(200).json(result)
    // I marked it as success for the browser, but, will use result to discover failure
  }
})

app.get('/api/store_sequence/:view', function (req, res) {
  let result = {}
  result = validateInput(req.params.view)
  res.json(result)
})

app.get('/', function (request, response) { // basic get route defined
  response.sendFile(__dirname + '/dist/index.html')
})

/* The following 'require' enables this server to handle api requests like:
    curl -X GET http://localhost:8888/api/store_sequence/WNYV
      (To test algorithm validating user input.)
    curl -X PUT http://localhost:8888/api/store_sequence/WNYV
      (NOT YET WORKING -- should "store" sequence to fake database.)
 */
require(__dirname + '/src/lib/store_sequence.js')(sequencedb, app) // other routes defined here

app.use(express.static(path.join(__dirname, 'dist')))

app.listen(PORT, function (error) {
  if (error) {
    console.error(error)
  } else {
    console.info('==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.', PORT, PORT)
  }
})

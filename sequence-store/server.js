var path = require('path')
var express = require('express')
var app = express()
var PORT = process.env.PORT || 8888

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

var favicon = require('serve-favicon')
app.use(favicon(__dirname + '/favicon.ico'))

const sequencedb = 'http://localhost:5959/' // fake db server at 5959

/* The following 'require' enables this server to handle api requests like:
    curl -X GET http://localhost:8888/api/store_sequence/WNYV
      (To test algorithm validating user input.)
    curl -X PUT http://localhost:8888/api/store_sequence/WNYV
      (NOT YET WORKING -- should "store" sequence to fake database.)
 */
require(__dirname + '/src/lib/store_sequence.js')(sequencedb, app) // other routes defined here

app.use(express.static(path.join(__dirname, 'dist')))

app.get('/', function (request, response) { // basic get route defined
  response.sendFile(__dirname + '/dist/index.html')
})

app.listen(PORT, function (error) {
  if (error) {
    console.error(error)
  } else {
    console.info('==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.', PORT, PORT)
  }
})

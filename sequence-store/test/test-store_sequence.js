'use strict'
const store_sequence = require('../src/lib/store_sequence.js')
var expectedValue = require('./store_sequence.json')
exports[store_sequence] = function (test) {
  store_sequence('PNOWVHYA')
}

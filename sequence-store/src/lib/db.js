'use strict'
var dao = {
  store (code, cb) {
    console.log(`Storing code ${code} to db...`)
    setTimeout(function () {
      console.log('...DB store done.')
      // by convention 1st arg is err; this immitates 'no error' in db
      cb(null, Math.round(Math.random() * 1000))
    }, 1000)
  }
}
module.exports = dao

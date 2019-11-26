const test = require('tape')
const testCommon = require('./common-sync')

function makeTest (name, testFn) {
  test(name, function (t) {
    var db = testCommon.factory()
    var done = function (err, close) {
      t.ifError(err, 'no error from done()')

      if (close === false) {
        t.end()
        return
      }

      try {
        db.close()
        t.end()
      } catch (err) {
        t.ifError(err, 'no error from close()')
      }
    }
    db.open()
    db.batch([
      { type: 'put', key: 'one', value: '1' },
      { type: 'put', key: 'two', value: '2' },
      { type: 'put', key: 'three', value: '3' }
    ])
    testFn(db, t, done)
  })
}

module.exports = makeTest

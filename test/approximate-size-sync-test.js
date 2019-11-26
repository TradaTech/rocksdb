const test = require('tape')
const testCommon = require('./common-sync')

var db

test('setUp common for approximate size', testCommon.setUp)

test('setUp db', function (t) {
  db = testCommon.factory()
  db.open()
  t.end()
})

test('test argument-less approximateSize() throws', function (t) {
  t.throws(
    db.approximateSize.bind(db)
    , { name: 'Error', message: 'approximateSize() requires valid `start`, `end` and `callback` arguments' }
    , 'no-arg approximateSize() throws'
  )
  t.end()
})

test('test callback-less, 1-arg, approximateSize() throws', function (t) {
  t.throws(
    db.approximateSize.bind(db, 'foo')
    , { name: 'Error', message: 'approximateSize() requires valid `start`, `end` and `callback` arguments' }
    , 'callback-less, 1-arg approximateSize() throws'
  )
  t.end()
})

test('test callback-less, 3-arg, approximateSize() throws', function (t) {
  t.throws(
    db.approximateSize.bind(db, function () {})
    , { name: 'Error', message: 'approximateSize() requires valid `start`, `end` and `callback` arguments' }
    , 'callback-only approximateSize() throws'
  )
  t.end()
})

test('test callback-only approximateSize() throws', function (t) {
  t.throws(
    db.approximateSize.bind(db, function () {})
    , { name: 'Error', message: 'approximateSize() requires valid `start`, `end` and `callback` arguments' }
    , 'callback-only approximateSize() throws'
  )
  t.end()
})

test('test 1-arg + callback approximateSize() throws', function (t) {
  t.throws(
    db.approximateSize.bind(db, 'foo', function () {})
    , { name: 'Error', message: 'approximateSize() requires valid `start`, `end` and `callback` arguments' }
    , '1-arg + callback approximateSize() throws'
  )
  t.end()
})

test('test custom _serialize*', function (t) {
  t.plan(4)
  var db = testCommon.factory()
  db._serializeKey = function (data) { return data }
  db.approximateSize = function (start, end) {
    t.deepEqual(start, { foo: 'bar' })
    t.deepEqual(end, { beep: 'boop' })
  }
  db.open()
  try {
    db.approximateSize({ foo: 'bar' }, { beep: 'boop' })
    t.error(null)
  } catch (err) {
    t.error(err)
  }
  try {
    db.close()
    t.error(null)
  } catch (err) {
    t.error(err)
  }
  t.end()
})

// test('test approximateSize()', function (t) {
//   var data = Array.apply(null, Array(10000)).map(function () {
//     return 'aaaaaaaaaa'
//   }).join('')

//   db.batch(Array.apply(null, Array(10)).map(function (x, i) {
//     return { type: 'put', key: 'foo' + i, value: data }
//   }), function (err) {
//     t.error(err)

//     // cycle open/close to ensure a pack to .sst

//     db.close(function (err) {
//       t.error(err)

//       db.open(function (err) {
//         t.error(err)

//         db.approximateSize('!', '~', function (err, size) {
//           t.error(err)

//           t.equal(typeof size, 'number')
//           // account for snappy compression, original would be ~100000
//           t.ok(size > 40000, 'size reports a reasonable amount (' + size + ')')
//           t.end()
//         })
//       })
//     })
//   })
// })

test('tearDown', function (t) {
  db.close()
  testCommon.tearDown.bind(null, t)()
})

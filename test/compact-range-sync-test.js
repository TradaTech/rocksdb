const test = require('tape')
const testCommon = require('./common-sync')

let db

test('setUp common', testCommon.setUp)

test('setUp db', function (t) {
  db = testCommon.factory()
  db.open()
  t.end()
})

test('test compactRange() frees disk space after key deletion', function (t) {
  var key1 = '000000'
  var key2 = '000001'
  var val1 = Buffer.allocUnsafe(64).fill(1)
  var val2 = Buffer.allocUnsafe(64).fill(1)

  db.batch().put(key1, val1).put(key2, val2).write()
  db.compactRange(key1, key2)
  const sizeAfterPuts = db.approximateSize('0', 'z')
  db.batch().del(key1).del(key2).write()
  db.compactRange(key1, key2)
  const sizeAfterCompact = db.approximateSize('0', 'z')
  t.ok(sizeAfterCompact < sizeAfterPuts)

  t.end()
})

test('test compactRange() serializes start and end', function (t) {
  t.plan(3)

  var clone = Object.create(db)
  var count = 0

  clone._serializeKey = function (key) {
    t.is(key, count++)
    return db._serializeKey(key)
  }

  try {
    clone.compactRange(0, 1)
    t.error(null)
  } catch (err) {
    t.ifError(err, 'no compactRange error')
  }
})

test('tearDown', function (t) {
  db.close()
  testCommon.tearDown.bind(null, t)()
})

const util = require('util')
const AbstractIterator = require('./abstract-leveldown/abstract-iterator')
const binding = require('./binding')

function Iterator (db, options) {
  AbstractIterator.call(this, db)

  this.context = binding.iterator_init(db.context, options)
  this.cache = null
  this.finished = false
}

util.inherits(Iterator, AbstractIterator)

Iterator.prototype._seek = function (target) {
  if (target.length === 0) {
    throw new Error('cannot seek() to an empty target')
  }

  this.cache = null
  binding.iterator_seek(this.context, target)
  this.finished = false
}

Iterator.prototype._next = function (callback) {
  var that = this

  if (this.cache && this.cache.length) {
    // process.nextTick(callback, null, this.cache.pop(), this.cache.pop())
    that._key = this.cache.pop()
    that._value = this.cache.pop()
  } else if (this.finished) {
    // process.nextTick(callback)
    that._key = undefined
    that._value = undefined
  } else {
    const [array, finished] = binding.iterator_next(this.context)
    that.cache = array
    that.finished = finished
    that._next(callback)
  }

  return this
}

Iterator.prototype._end = function (callback) {
  delete this.cache
  return binding.iterator_end(this.context, callback)
}

module.exports = Iterator

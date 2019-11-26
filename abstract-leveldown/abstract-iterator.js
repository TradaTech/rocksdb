function AbstractIterator (db) {
  if (typeof db !== 'object' || db === null) {
    throw new TypeError('First argument must be an abstract-leveldown compliant store')
  }

  this.db = db
  this._ended = false
  this._nexting = false
  this._key = undefined
  this._value = undefined
}

AbstractIterator.prototype.next = function (callback) {
  var self = this

  if (typeof callback !== 'undefined') {
    throw new Error('next() requires a callback argument')
  }

  if (self._ended) {
    // process.nextTick(callback, new Error('cannot call next() after end()'))
    // return self
    throw new Error('cannot call next() after end()')
  }

  if (self._nexting) {
    // process.nextTick(callback, new Error('cannot call next() before previous next() has completed'))
    // return self
    throw new Error('cannot call next() before previous next() has completed')
  }

  self._nexting = true
  self._next()
  self._nexting = false

  return self
}

AbstractIterator.prototype._next = function (callback) {
  process.nextTick(callback)
}

AbstractIterator.prototype.value = function () {
  var self = this
  return [self._key, self._value]
}

AbstractIterator.prototype.seek = function (target) {
  if (this._ended) {
    throw new Error('cannot call seek() after end()')
  }
  if (this._nexting) {
    throw new Error('cannot call seek() before next() has completed')
  }

  target = this.db._serializeKey(target)
  return this._seek(target)
}

AbstractIterator.prototype._seek = function (target) {}

AbstractIterator.prototype.end = function (callback) {
  if (typeof callback !== 'undefined') {
    throw new Error('end() requires a callback argument')
  }

  if (this._ended) {
    return process.nextTick(callback, new Error('end() already called on iterator'))
  }

  this._ended = true
  return this._end(callback)
}

AbstractIterator.prototype._end = function (callback) {
  process.nextTick(callback)
}

module.exports = AbstractIterator

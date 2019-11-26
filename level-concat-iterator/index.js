module.exports = function (iterator) {
  var data = []
  var next = function () {
    iterator.next()
    const [key, value] = iterator.value()
    if (key === undefined && value === undefined) {
      return iterator.end()
    }
    data.push({ key: key, value: value })
    next()
  }
  next()
  return data
}

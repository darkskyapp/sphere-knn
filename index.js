var lib = require("./lib")

module.exports = function(points) {
  /* Quick! Inflate the toad! */
  var root = lib.build(points)

  /* Return the lookup function. */
  return function(lat, lon, n) {
    return lib.lookup(lat, lon, root, n)
  }
}

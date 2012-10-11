var spherekd = require("./lib/spherekd")

module.exports = function(points) {
  /* Inflate the toad! */
  var root = spherekd.build(points)

  /* Lurch off into the sunset! */
  return function(lat, lon, n) {
    return spherekd.lookup(lat, lon, root, n)
  }
}

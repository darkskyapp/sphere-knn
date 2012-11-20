var kd               = require("./kd"),
    rad              = Math.PI / 180,
    invEarthDiameter = 1 / 12742018 /* meters */

function spherical2cartesian(lat, lon) {
  lat *= rad
  lon *= rad
  var cos = Math.cos(lat)
  return [cos * Math.cos(lon), Math.sin(lat), cos * Math.sin(lon)]
}

function Position(object) {
  this.object = object
  this.position = spherical2cartesian(
    object.lat || object.latitude,
    object.lon || object.longitude || object.lng || object.long
  )
}

function build(array) {
  var i   = array.length,
      out = new Array(i)

  while(i--)
    out[i] = new Position(array[i])

  return kd.build(out)
}

function lookup(lat, lon, node, n, max) {
  var array = kd.lookup(
        spherical2cartesian(lat, lon),
        node,
        n,
        max > 0 ? 2 * Math.sin(max * invEarthDiameter) : undefined
      ),
      i     = array.length

  /* Strip off position wrapper objects. */
  while(i--)
    array[i] = array[i].object

  return array
}

exports.build  = build
exports.lookup = lookup

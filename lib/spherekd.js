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
  var lat, lon;

  /* Find latitude. */
  if(object.hasOwnProperty("lat"))
    lat = object.lat;

  else if(object.hasOwnProperty("latitude"))
    lat = object.latitude;

  else if(object.hasOwnProperty("location") &&
          Array.isArray(object.location) &&
          object.location.length === 2)
    lat = object.location[0];

  /* Find longitude. */
  if(object.hasOwnProperty("lon"))
    lon = object.lon;

  else if(object.hasOwnProperty("longitude"))
    lon = object.longitude;

  else if(object.hasOwnProperty("lng"))
    lon = object.lng;

  else if(object.hasOwnProperty("long"))
    lon = object.long;

  else if(object.hasOwnProperty("location") &&
          Array.isArray(object.location) &&
          object.location.length === 2)
    lon = object.location[1];

  /* Finally, set this object's properties. */
  this.object = object;
  this.position = spherical2cartesian(lat, lon);
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

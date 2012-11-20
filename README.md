sphere-knn
==========

`sphere-knn` is a Node.JS module that provides fast nearest-neighbor lookups on
a sphere. This is useful if, for example, you have a database of geographic
points (latitude, longitude) and want to swiftly look up which of those points
are near a given latitude, longitude pair. It came out of a need to do such
lookups in the [Dark Sky API](http://developer.darkskyapp.com/), but all
existing libraries either threw scary runtime flags, were too slow, broke at
the International Date Line, or *didn't have tests*.

So anyway, this one is well-tested and works correctly regardless of where on
the earth things are located. It's been in production use at Dark Sky since
Oct 2012.

Usage
-----

To install:

    npm install sphere-knn

To use:

    var sphereKnn = require("sphere-knn"),
        lookup    = sphereKnn([
          /* This array needs to be full of objects that have latitudes and
           * longitudes. Accepted property names are "lat", "latitude", "lon",
           * "lng", "long", "longitude". */
          {lat: ..., lon: ...},
          ...
        ])

    var points = lookup(someLatitude, someLongitude, maxResults, maxDistance)

The `points` array consists of objects that were in the array passed to
`sphereKnn()`, ordered from nearest to furthest. The `maxResults` value is the
maximum size of the returned array, and is mandatory. (Often, you'll just want
it set to 1, but there are use-cases for more points.) The `maxDistance` value
is the maximum distance away we should look up for in meters. This is handy if
you want to find, say, any points within 200 kilometers of a given point.
`maxDistance` is optional and defaults to Infinity. (Please note that since our
backing earth model is a sphere, all distances given to this function are
approximate. If it matters that much to you, add a few meters of padding and
check the results with some very accurate (and complex) distance function.)

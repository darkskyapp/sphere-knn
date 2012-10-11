var assert = require("chai").assert,
    lib    = require("./lib")

describe("sphere-nn", function() {
  describe("binary", function() {
    describe("search", function() {
      /* FIXME */
    })

    describe("insert", function() {
      /* FIXME */
    })
  })

  describe("lib", function() {
    function City(name, lat, lon) {
      this.name = name
      this.lat  = lat
      this.lon  = lon
    }

    var boston   = new City("Boston",    42.358, -71.064),
        troy     = new City("Troy",      42.732, -73.693),
        newYork  = new City("New York",  40.664, -73.939),
        miami    = new City("Miami",     25.788, -80.224),
        london   = new City("London",    51.507,  -0.128),
        paris    = new City("Paris",     48.857,   2.351),
        vienna   = new City("Vienna",    48.208,  16.373),
        rome     = new City("Rome",      41.900,  12.500),
        beijing  = new City("Beijing",   39.914, 116.392),
        hongKong = new City("Hong Kong", 22.278, 114.159),
        seoul    = new City("Seoul",     37.567, 126.978),
        tokyo    = new City("Tokyo",     35.690, 139.692),
        cities = [
          boston, troy, newYork, miami, london, paris, vienna, rome, beijing,
          hongKong, seoul, tokyo
        ]

    describe("build", function() {
      it("should return null given an empty array", function() {
        assert.isNull(lib.build([]))
      })

      it("should construct a KD Tree from the raw data", function() {
        var root = lib.build(cities)

        assert.equal(root.axis, 0)
        assert.closeTo(root.split, 0.1905, 0.0001)

        assert.equal(root.left.axis, 1)
        assert.closeTo(root.left.split, 0.3774, 0.0001)

        assert.equal(root.left.left.axis, 1)
        assert.closeTo(root.left.left.split, -0.4287, 0.0001)

        assert.deepEqual(root.left.left.left.object, newYork)

        assert.equal(root.left.left.right.axis, 1)
        assert.closeTo(root.left.left.right.split, 0.3459, 0.0001)

        assert.deepEqual(root.left.left.right.left.object, miami)
        assert.deepEqual(root.left.left.right.right.object, hongKong)

        assert.equal(root.left.right.axis, 1)
        assert.closeTo(root.left.right.split, 0.4871, 0.0001)

        assert.deepEqual(root.left.right.left.object, tokyo)

        assert.equal(root.left.right.right.axis, 1)
        assert.closeTo(root.left.right.right.split, 0.5748, 0.0001)

        assert.deepEqual(root.left.right.right.left.object, seoul)
        assert.deepEqual(root.left.right.right.right.object, beijing)

        assert.equal(root.right.axis, 1)
        assert.closeTo(root.right.split, 0.0309, 0.0001)

        assert.equal(root.right.left.axis, 1)
        assert.closeTo(root.right.left.split, -0.6373, 0.0001)

        assert.deepEqual(root.right.left.left.object, troy)

        assert.equal(root.right.left.right.axis, 1)
        assert.closeTo(root.right.left.right.split, -0.0017, 0.0001)

        assert.deepEqual(root.right.left.right.left.object, boston)
        assert.deepEqual(root.right.left.right.right.object, london)

        assert.equal(root.right.right.axis, 1)
        assert.closeTo(root.right.right.split, 0.1445, 0.0001)

        assert.deepEqual(root.right.right.left.object, paris)

        assert.equal(root.right.right.right.axis, 2)
        assert.closeTo(root.right.right.right.split, 0.7443, 0.0001)

        assert.deepEqual(root.right.right.right.left.object, vienna)
        assert.deepEqual(root.right.right.right.right.object, rome)
      })
    })

    describe("lookup", function() {
      var tree = lib.build(cities)

      it("should return New York, Troy, Boston, and Miami as the four closest cities to Philadelphia", function() {
        assert.deepEqual(
          lib.lookup(39.95, -75.17, tree, 4),
          [newYork, troy, boston, miami]
        )
      })

      it("should return Vienna, Paris, Rome, and London as the four closest cities to Berlin", function() {
        assert.deepEqual(
          lib.lookup(52.50, 13.40, tree, 4),
          [vienna, paris, rome, london]
        )
      })

      it("should return Miami and Hong Kong as the two closest cities to Hawaii", function() {
        assert.deepEqual(
          lib.lookup(21.31, -157.80, tree, 2),
          [miami, hongKong]
        )
      })
    })
  })
})

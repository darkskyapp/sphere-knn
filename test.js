var assert   = require("chai").assert,
    binary   = require("./lib/binary"),
    spherekd = require("./lib/spherekd")

describe("sphere-nn", function() {
  describe("binary", function() {
    describe("search", function() {
      var array = [
            2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61
          ]

      it("should return the correct index of the first item", function() {
        assert.equal(binary.search(2, array), 0)
      })

      it("should return the correct index of the last item", function() {
        assert.equal(binary.search(61, array), 17)
      })

      it("should return the correct index of an arbitrary item", function() {
        assert.equal(binary.search(23, array), 8)
      })

      it("should return the correct index of a missing item before the first", function() {
        assert.equal(binary.search(1, array), -1)
      })

      it("should return the correct index of a missing item after the last", function() {
        assert.equal(binary.search(1000, array), -19)
      })

      it("should return the correct index of a missing item after the last", function() {
        assert.equal(binary.search(10, array), -5)
      })
    })

    describe("insert", function() {
      it("should correctly insert into an empty array", function() {
        var a = []
        binary.insert(50, a)
        assert.deepEqual(a, [50])
      })

      it("should correctly insert before the beginning of an array", function() {
        var a = [50]
        binary.insert(25, a)
        assert.deepEqual(a, [25, 50])
      })

      it("should correctly insert after the end of an array", function() {
        var a = [25, 50]
        binary.insert(75, a)
        assert.deepEqual(a, [25, 50, 75])
      })

      it("should correctly insert in the middle of an array", function() {
        var a = [25, 50, 75]
        binary.insert(62.5, a)
        assert.deepEqual(a, [25, 50, 62.5, 75])
      })

      it("should correctly insert a duplicate into the middle of an array", function() {
        var a = [25, 50, 62.5, 75]
        binary.insert(50, a)
        assert.deepEqual(a, [25, 50, 50, 62.5, 75])
      })
    })
  })

  describe("spherekd", function() {
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
        assert.isNull(spherekd.build([]))
      })

      it("should construct a KD Tree from the raw data", function() {
        var root = spherekd.build(cities)

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
      var tree = spherekd.build(cities)

      it("should return New York, Troy, Boston, and Miami as the four closest cities to Philadelphia", function() {
        assert.deepEqual(
          spherekd.lookup(39.95, -75.17, tree, 4),
          [newYork, troy, boston, miami]
        )
      })

      it("should return Vienna, Paris, Rome, and London as the four closest cities to Berlin", function() {
        assert.deepEqual(
          spherekd.lookup(52.50, 13.40, tree, 4),
          [vienna, paris, rome, london]
        )
      })

      it("should return Miami and Hong Kong as the two closest cities to Hawaii", function() {
        assert.deepEqual(
          spherekd.lookup(21.31, -157.80, tree, 2),
          [miami, hongKong]
        )
      })
    })
  })
})

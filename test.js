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

        assert.deepEqual(root, {
          axis: 0,
          split: 0.19053158295861533,
          left: {
            axis: 1,
            split: 0.3773989344349447,
            left: {
              axis: 2,
              split: 0.9004099062436204,
              left: {
                object: {
                  name: 'New York',
                  lat: 40.664,
                  lon: -73.939
                },
                position: [
                  0.18027811770100247,
                  -0.6261876186874332,
                  0.7585439120319568
                ]
              },
              right: {
                axis: 0,
                split: 0.07386879316524526,
                left: {
                  object: {
                    name: 'Hong Kong',
                    lat: 22.278,
                    lon: 114.159
                  },
                  position: [
                    -0.1551547027349873,
                    0.3458966504750293,
                    0.92535535088385
                  ]
                },
                right: {
                  object: {
                    name: 'Miami',
                    lat: 25.788,
                    lon: -80.224
                  },
                  position: [
                    0.07386879316524526,
                    -0.42872532247893286,
                    0.9004099062436204
                  ]
                }
              }
            },
            right: {
              axis: 2,
              split: 0.7926409303101206,
              left: {
                object: {
                  name: 'Beijing',
                  lat: 39.914,
                  lon: 116.392
                },
                position: [
                  -0.2852141628223588,
                  0.5747616950378845,
                  0.767008393202264
                ]
              },
              right: {
                axis: 0,
                split: -0.36673285061524413,
                left: {
                  object: {
                    name: 'Tokyo',
                    lat: 35.69,
                    lon: 139.692
                  },
                  position: [
                    -0.4448876066657038,
                    0.3773989344349447,
                    0.8121853616771422
                  ]
                },
                right: {
                  object: {
                    name: 'Seoul',
                    lat: 37.567,
                    lon: 126.978
                  },
                  position: [
                    -0.36673285061524413,
                    0.4870599263712049,
                    0.7926409303101206
                  ]
                }
              }
            }
          },
          right: {
            axis: 1,
            split: 0.03089181087201134,
            left: {
              axis: 2,
              split: 0.7345357247383564,
              left: {
                object: {
                  name: 'London',
                  lat: 51.507,
                  lon: -0.128
                },
                position: [
                  0.7826822523922511,
                  -0.0017485318434385033,
                  0.6224190183683216
                ]
              },
              right: {
                axis: 0,
                split: 0.2186433574245326,
                left: {
                  object: {
                    name: 'Troy',
                    lat: 42.732,
                    lon: -73.693
                  },
                  position: [
                    0.19053158295861533,
                    -0.6512718211149489,
                    0.7345357247383564
                  ]
                },
                right: {
                  object: {
                    name: 'Boston',
                    lat: 42.358,
                    lon: -71.064
                  },
                  position: [
                    0.2186433574245326,
                    -0.6372980619186491,
                    0.738949431645266
                  ]
                }
              }
            },
            right: {
              axis: 2,
              split: 0.6664283756670815,
              left: {
                object: {
                  name: 'Paris',
                  lat: 48.857,
                  lon: 2.351
                },
                position: [
                  0.7524359495443756,
                  0.03089181087201134,
                  0.6579406035914653
                ]
              },
              right: {
                axis: 0,
                split: 0.7153339349844794,
                left: {
                  object: {
                    name: 'Rome',
                    lat: 41.9,
                    lon: 12.5
                  },
                  position: [
                    0.6520022573310842,
                    0.14454542048145,
                    0.744311546231154
                  ]
                },
                right: {
                  object: {
                    name: 'Vienna',
                    lat: 48.208,
                    lon: 16.373
                  },
                  position: [
                    0.7153339349844794,
                    0.21016798415875806,
                    0.6664283756670815
                  ]
                }
              }
            }
          }
        })
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

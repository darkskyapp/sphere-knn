var assert   = require("chai").assert,
    binary   = require("./lib/binary"),
    spherekd = require("./lib/spherekd")

describe("sphere-knn", function() {
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
          split: 0.20985921950633998,
          left: {
            axis: 1,
            split: 0.6096887366493714,
            left: {
              axis: 2,
              split: 0.5253996743519346,
              left: {
                object: miami,
                position: [
                  0.1528866465300001,
                  0.43504252750547817,
                  -0.8873351523378616
                ]
              },
              right: {
                axis: 0,
                split: -0.37872039680406316,
                left: {
                  object: tokyo,
                  position: [
                    -0.6193546995975014,
                    0.5833994671555415,
                    0.5253996743519346
                  ]
                },
                right: {
                  object: hongKong,
                  position: [
                    -0.37872039680406316,
                    0.37910087653634733,
                    0.844306452926866
                  ]
                }
              }
            },
            right: {
              axis: 2,
              split: 0.6332143107601375,
              left: {
                object: troy,
                position: [
                  0.20624585628442826,
                  0.6785700178191618,
                  -0.7049860833253415
                ]
              },
              right: {
                axis: 0,
                split: -0.3409429851536599,
                left: {
                  object: seoul,
                  position: [
                    -0.4767801181377611,
                    0.6096887366493714,
                    0.6332143107601375
                  ]
                },
                right: {
                  object: beijing,
                  position: [
                    -0.3409429851536599,
                    0.6416370662276932,
                    0.6870660493120221
                  ]
                }
              }
            }
          },
          right: {
            axis: 1,
            split: 0.745569057905259,
            left: {
              axis: 2,
              split: -0.6989587067659011,
              left: {
                object: newYork,
                position: [
                  0.20985921950633998,
                  0.6516219252904669,
                  -0.7289361936884015
                ]
              },
              right: {
                axis: 0,
                split: 0.7266683906387393,
                left: {
                  object: boston,
                  position: [
                    0.23979780809048454,
                    0.6737608904285988,
                    -0.6989587067659011
                  ]
                },
                right: {
                  object: rome,
                  position: [
                    0.7266683906387393,
                    0.6678325554710466,
                    0.1610985037159434
                  ]
                }
              }
            },
            right: {
              axis: 2,
              split: 0.026989498186927637,
              left: {
                object: london,
                position: [
                  0.6224174651684267,
                  0.782684205521879,
                  -0.001390496276659977
                ]
              },
              right: {
                axis: 0,
                split: 0.6573868000210528,
                left: {
                  object: vienna,
                  position: [
                    0.6394026512991717,
                    0.745569057905259,
                    0.18785906793619112
                  ]
                },
                right: {
                  object: paris,
                  position: [
                    0.6573868000210528,
                    0.7530698255445496,
                    0.026989498186927637
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

      it("should return Vienna, Paris, London, and Rome as the four closest cities to Berlin", function() {
        assert.deepEqual(
          spherekd.lookup(52.50, 13.40, tree, 4),
          [vienna, paris, london, rome]
        )
      })

      it("should return Tokyo and Seoul as the two closest cities to Hawaii", function() {
        assert.deepEqual(
          spherekd.lookup(21.31, -157.80, tree, 2),
          [tokyo, seoul]
        )
      })

      it("should return Troy, Boston, and New York as the only cities within 200km of Hartford", function() {
        assert.deepEqual(
          spherekd.lookup(41.76, -72.67, tree, 20, 200000),
          [troy, boston, newYork]
        )
      })
    })
  })
})

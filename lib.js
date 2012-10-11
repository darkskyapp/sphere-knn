/* FIXME: Break out the KD tree stuff into it's own file, and then wrap it with
 * the spherical conversion stuff. */

var rad = Math.PI / 180

function spherical2cartesian(lat, lon) {
  lat *= rad
  lon *= rad
  var sin = Math.sin(lat)
  return [Math.cos(lon) * sin, Math.sin(lon) * sin, Math.cos(lat)]
}

function Node(axis, split, left, right) {
  this.axis  = axis
  this.split = split
  this.left  = left
  this.right = right
}

function Leaf(object, lat, lon) {
  this.object   = object
  this.position = spherical2cartesian(
    object.lat || object.latitude,
    object.lon || object.longitude
  )
}

function Candidate(leaf, position) {
  var dx = position[0] - leaf.position[0],
      dy = position[1] - leaf.position[1],
      dz = position[2] - leaf.position[2]

  this.object = leaf.object
  this.dist   = dx * dx + dy * dy + dz * dz
}

function byDistance(a, b) {
  return a.dist - b.dist
}

/* FIXME: We can precalculate this in `build()` and then pass it along in
 * `buildrec()`, only modifying the dimension that matters based on the
 * splitting plane. That would greatly speed up KD-tree creation by lowering
 * the constant. */
function boundingDimensions(array) {
  var i   = array.length - 1,
      min = array[i].position.slice(0),
      max = array[i].position.slice(0),
      j

  while(i--) {
    j = array[i].position.length

    while(j--) {
      if(array[i].position[j] < min[j])
        min[j] = array[i].position[j]

      if(array[i].position[j] > max[j])
        max[j] = array[i].position[j]
    }
  }

  j = max.length
  while(j--)
    max[j] -= min[j]

  return max
}

function indexOfMax(array) {
  var i = array.length - 1,
      j = i

  while(i--)
    if(array[i] > array[j])
      j = i

  return j
}

function buildrec(array) {
  /* This should only happen if you request a kd-tree with zero elements. */
  if(array.length === 0)
    return null

  /* If there's only one item, then it's a leaf node! */
  if(array.length === 1)
    return array[0]

  /* Uh oh. Well, we have to partition the data set and recurse. Start by
   * finding the bounding box of the given points; whichever side is the
   * longest is the one we'll use for the splitting plane. */
  var axis = indexOfMax(boundingDimensions(array))

  /* Sort the points along the splitting plane. */
  array.sort(function(a, b) {
    return a.position[axis] - b.position[axis]
  })

  /* Find the median point. It's position is going to be the location of the
   * splitting plane. */
  var i = Math.floor(array.length * 0.5)

  /* Split, recurse, yadda yadda. */
  return new Node(
    axis,
    array[i].position[axis],
    buildrec(array.slice(0, i)),
    buildrec(array.slice(i))
  )
}

function build(input) {
  var i = input.length,
      output = new Array(i)

  while(i--)
    output[i] = new Leaf(input[i])

  return buildrec(output)
}

function lookup(lat, lon, node, n) {
  var array = []

  /* Degenerate cases. */
  if(node === null || n <= 0)
    return array

  var position = spherical2cartesian(lat, lon),
      stack    = [node, 0],
      dist

  while(stack.length) {
    dist = stack.pop()
    node = stack.pop()

    if(array.length === n && array[array.length - 1].dist < dist * dist)
      continue

    while(node instanceof Node) {
      if(position[node.axis] < node.split) {
        stack.push(node.right, node.split - position[node.axis])
        node = node.left
      }

      else {
        stack.push(node.left, position[node.axis] - node.split)
        node = node.right
      }
    }

    /* FIXME: This is like the worst possible way to do this. Binary insertion,
     * please! */
    array.push(new Candidate(node, position))
    array.sort(byDistance)

    if(array.length > n)
      array.pop()
  }

  /* Strip candidate wrapper objects. */
  var i = array.length

  while(i--)
    array[i] = array[i].object

  return array
}

exports.build  = build
exports.lookup = lookup

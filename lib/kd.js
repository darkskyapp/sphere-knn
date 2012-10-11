var binary = require("./binary")

function Node(axis, split, left, right) {
  this.axis  = axis
  this.split = split
  this.left  = left
  this.right = right
}

function distance(a, b) {
  var i = Math.min(a.length, b.length),
      d = 0,
      k

  while(i--) {
    k  = b[i] - a[i]
    d += k * k
  }

  return d
}

function Candidate(object, position) {
  this.object = object
  this.dist   = distance(position, object.position)
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

function build(array) {
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
    build(array.slice(0, i)),
    build(array.slice(i))
  )
}

function lookup(position, node, n) {
  var array = []

  /* Degenerate cases. */
  if(node === null || n <= 0)
    return array

  var stack = [node, 0],
      dist, i

  while(stack.length) {
    dist = stack.pop()
    node = stack.pop()

    /* If we've already found enough locations, and the furthest one is closer
     * than this subtree possibly could be, just skip the subtree. */
    if(array.length === n && array[array.length - 1].dist < dist * dist)
      continue

    /* Iterate all the way down the tree, adding nodes that we need to remember
     * to visit later onto the stack. */
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

    /* Once we've hit a leaf node, insert it into the array of candidates,
     * making sure to keep the array in sorted order. */
    binary.insert(new Candidate(node, position), array, byDistance)

    /* If the array's too long, cull it. */
    if(array.length > n)
      array.pop()
  }

  /* Strip candidate wrapper objects. */
  i = array.length

  while(i--)
    array[i] = array[i].object

  return array
}

exports.build  = build
exports.lookup = lookup

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

function byDistance(a, b) {
  return a.dist - b.dist
}

function buildrec(array, depth) {
  /* This should only happen if you request a kd-tree with zero elements. */
  if(array.length === 0)
    return null

  /* If there's only one item, then it's a leaf node! */
  if(array.length === 1)
    return array[0]

  /* Uh oh. Well, we have to partition the data set and recurse. Start by
   * finding the bounding box of the given points; whichever side is the
   * longest is the one we'll use for the splitting plane. */
  var axis = depth % array[0].position.length

  /* Sort the points along the splitting plane. */
  /* FIXME: For very large trees, it would be faster to use some sort of median
   * finding and partitioning algorithm. It'd also be a lot more complicated. */
  array.sort(function(a, b) {
    return a.position[axis] - b.position[axis]
  })

  /* Find the median point. It's position is going to be the location of the
   * splitting plane. */
  var i = Math.floor(array.length * 0.5)

  /* Split, recurse, yadda yadda. */
  ++depth

  return new Node(
    axis,
    array[i].position[axis],
    buildrec(array.slice(0, i), depth),
    buildrec(array.slice(i   ), depth)
  )
}

function build(array) {
  return buildrec(array, 0)
}

function lookup(position, node, n, max) {
  if(!(max > 0))
    max = Number.POSITIVE_INFINITY

  var array = []

  /* Degenerate cases. */
  if(node === null || n <= 0)
    return array

  var stack = [node, 0],
      dist, i

  while(stack.length) {
    dist = stack.pop()
    node = stack.pop()

    /* If this subtree is further away than we care about, then skip it. */
    if(dist > max)
      continue

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
    dist = distance(position, node.position)
    if(dist <= max * max)
      binary.insert({object: node, dist: dist}, array, byDistance)

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

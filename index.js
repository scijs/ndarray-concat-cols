'use strict'

module.exports = concatColumns
var extend = require('util-extend')
var ops = require('ndarray-ops')
var pool = require('ndarray-scratch')

var defaults = {
  dtype: 'double'
}

function concatColumns () {
  var output, input, inputs, options, d, i, shape, slice, s1, lo, hi

  options = extend({}, defaults)

  if (arguments.length === 0) {
    throw new Error('Array of ndarrays to concatenate must not be empty')
  }

  if (Array.isArray(arguments[0])) {
    // If the first argument is an array, then assume it's the list
    // of arrays to concatenate:
    inputs = arguments[0]
    extend(options, arguments[1] || {})
  } else if (arguments.length === 2) {
    // Otherwise assume the first argument is the output array:
    inputs = arguments[1]
    output = arguments[0]
    extend(options, arguments[2] || {})
  }

  if (inputs.length === 0) {
    throw new Error('Array of ndarrays to concatenate must not be empty')
  }

  if (inputs[0].dimension === 1) {
    // This is the only special case in either ndarray-concat-rows or ndarray-concat-cols.
    // Everything else works like it should; this is the magic where we account for the
    // fact that ndarray has no concept of row vs column vectors.

    // The shape is easy to calculate:
    shape = [inputs[0].shape[0], inputs.length]

    // Now we just need to verify it:
    for (i = 0; i < inputs.length; i++) {
      input = inputs[i]
      if (input.dimension !== 1) {
        throw new Error('all arrays must have the same dimensionality')
      }

      if (input.shape[0] !== shape[0]) {
        throw new Error('last n-1 dimensions of concatenated columns must have the same size')
      }
    }

    if (output) {
      if (shape[1] !== output.shape[1] || shape[0] !== output.shape[0]) {
        throw new Error('dimensions of output array must match dimension of concatenated columns')
      }
    } else {
      output = pool.zeros(shape, options.dtype)
    }

    for (i = 0; i < inputs.length; i++) {
      ops.assign(output.pick(null, i), inputs[i])
    }

    return output
  }

  for (d = 0; d < inputs.length; d++) {
    // Verify the other dimensions:
    if (!shape) {
      // If no shape is set, set it:
      shape = inputs[d].shape.slice(0)
    } else {
      // If shape is set, then this shape must match:
      for (i = 0; i < inputs[d].shape.length - 1; i++) {
        if (inputs[d].shape[i] !== shape[i]) {
          throw new Error('last n-1 dimensions of concatenated columns must have the same size')
        }
      }

      // Add to the size of the concatenated dimension:
      // At the very least, all arrays must share teh same dimensionality:
      if (inputs[d].dimension !== shape.length) {
        throw new Error('all arrays must have the same dimensionality')
      }

      // If shape is set, then this shape must match:
      for (i = 0; i < inputs[d].shape.length - 1; i++) {
        if (inputs[d].shape[i] !== shape[i]) {
          throw new Error('last n-1 dimensions of concatenated columns must have the same size')
        }
      }

      // Add to the size of the concatenated dimension:
      shape[shape.length - 1] += inputs[d].shape[shape.length - 1]
    }
  }

  if (output) {
    if (shape[0] !== output.shape[0]) {
      throw new Error('first dimension of output array must match the total number of concatenated columns')
    }
  } else {
    output = pool.zeros(shape, options.dtype)
  }

  lo = new Array(shape.length)
  hi = new Array(shape.length)
  for (i = 0; i < shape.length - 1; i++) {
    lo[i] = 0
    hi[i] = shape[i]
  }

  s1 = shape.length - 1

  for (i = 0, lo[s1] = 0, hi[s1] = 0; i < inputs.length; i++) {
    input = inputs[i]
    hi[s1] = input.shape[s1]
    slice = output.lo.apply(output, lo)
    slice = slice.hi.apply(slice, hi)
    ops.assign(slice, input)
    lo[s1] += hi[s1]
  }

  return output
}

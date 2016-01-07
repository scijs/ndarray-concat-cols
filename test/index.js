/* global describe, it */
'use strict'

var c = require('../')
var ndarray = require('ndarray')
var assert = require('chai').assert
var ndt = require('ndarray-tests')
var pool = require('ndarray-scratch')

describe('concat-cols', function () {
  it('concatenating nothing fails', function () {
    assert.throws(function () {
      c()
    }, Error, 'must not be empty')
  })

  it('concatenating an empty list', function () {
    assert.throws(function () {
      c([])
    }, Error, 'must not be empty')
  })

  it('concatenates cols', function () {
    //
    // [1]   [4]   [1 4]
    // [2] + [5] = [2 5]
    // [3]   [6]   [3 6]
    //
    var out = c([ndarray([1, 2, 3]), ndarray([4, 5, 6])])
    assert(ndt.equal(out, ndarray([1, 4, 2, 5, 3, 6], [3, 2])))
  })

  it('concatenates three cols', function () {
    //
    // [1]   [4]   [1]   [1 4]
    // [2] + [5] + [2] = [2 5]
    // [3]   [6]   [3]   [3 6]
    //
    var x = ndarray([1, 2, 3])
    var y = ndarray([4, 5, 6])
    var out = c([x, y, x])
    assert(ndt.equal(out, ndarray([1, 4, 1, 2, 5, 2, 3, 6, 3], [3, 3])))
  })

  it('concatenates cols into an output array', function () {
    //
    // [1]   [4]   [1 4]
    // [2] + [5] = [2 5]
    // [3]   [6]   [3 6]
    //
    var out = pool.zeros([3, 2])
    c(out, [ndarray([1, 2, 3]), ndarray([4, 5, 6])])
    assert(ndt.equal(out, ndarray([1, 4, 2, 5, 3, 6], [3, 2]), 1e-8))
  })

  it("throws an error if output size doesn't match input", function () {
    //
    // [1 2 3] + [4 5 6] -> [. . . . . . .] -> error
    //
    var out = pool.zeros([3, 3])
    assert.throws(function () {
      c(out, [ndarray([1, 2, 3]), ndarray([4, 5, 6])])
    }, Error, 'dimensions of output array must match')
  })

  it('concatenates a matrix + row vector', function () {
    var out = c([ndarray([1, 2, 3, 4], [2, 2]), ndarray([5, 6], [2, 1])])
    assert(ndt.equal(out, ndarray([1, 2, 5, 3, 4, 6], [2, 3]), 1e-8))
  })

  it('fails to concatenate vector + matrix', function () {
    assert.throws(function () {
      c([ndarray([5, 6]), ndarray([1, 2, 3, 4], [2, 2])])
    }, Error, 'all arrays must have the same dimensionality')
  })

  it('fails to concatenate matrix + vector', function () {
    assert.throws(function () {
      c([ndarray([1, 2, 3, 4], [2, 2]), ndarray([5, 6])])
    }, Error, 'all arrays must have the same dimensionality')
  })

  it('concatenates matrix cols', function () {
    //
    // [1]   [4 7]    [1 4 7]
    // [2] + [5 8] -> [2 5 8]
    // [3]   [6 9]    [3 6 9]
    //
    var x = ndarray([1, 2, 3], [3, 1])
    var y = ndarray([4, 7, 5, 8, 6, 9], [3, 2])
    var z = ndarray([1, 4, 7, 2, 5, 8, 3, 6, 9], [3, 3])
    assert(ndt.equal(c([x, y]), z))
  })

  it("throws an error if cross dimensions don't match", function () {
    //
    // [1 2]   [ 7  8  9 10]
    // [3 4] + [11 12 13 14] -> error
    // [5 6]
    //
    var x = ndarray([1, 2, 3, 4, 5, 6], [3, 2])
    var y = ndarray([7, 8, 9, 10, 11, 12, 13, 14], [2, 4])
    assert.throws(function () {
      c([x, y])
    }, Error, 'last n-1')
  })

  it('concatenates 3d arrays', function () {
    var x = ndarray([1, 2, 3, 4, 5, 6, 7, 8], [2, 2, 2])
    var y = ndarray([9, 10, 11, 12, 13, 14, 15, 16], [2, 2, 2])
    assert(ndt.equal(c([x, y]), ndarray([1, 2, 9, 10, 3, 4, 11, 12, 5, 6, 13, 14, 7, 8, 15, 16], [2, 2, 4])))
  })
})

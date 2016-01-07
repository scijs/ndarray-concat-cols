# ndarray-concat-cols [![Build Status](https://travis-ci.org/scijs/ndarray-concat-cols.svg)](https://travis-ci.org/scijs/ndarray-concat-cols) [![npm version](https://badge.fury.io/js/ndarray-concat-cols.svg)](https://badge.fury.io/js/ndarray-concat-cols) [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

> Concatenate ndarrays by column (along the last dimension)

## Introduction

This module takes a list of input ndarrays and concatenates it along the last dimension. That is, a 3 &times; 2 ndarray concatenated with a 3 &times; 5 ndarray yields a 3 &times; 7 ndarray.

## Examples

Understanding `[+]` in the comments below to indicate column concatenation,

```javascript
var ndarray = require('ndarray')
var r = require('ndarray-concat-cols')

// Concatenating vectors:
//   [1]     [4]   [1 4]
//   [2] [+] [5] = [2 5]
//   [3]     [6]   [3 6]
r([ ndarray([1, 2, 3]), ndarray([4, 5, 6]) ])
// => ndarray([1, 4, 2, 5, 3, 6], [3, 2])

// Concatenating matrices:
//   [1 2]     [7]    [1 2 7]
//   [3 4] [+] [8] -> [3 4 8]
//   [5 6]     [9]    [5 6 9]
//
r([ ndarray([1, 2, 3, 4, 5, 6], [3, 2]), ndarray([7, 9, 9], [3, 1]) ])
// => ndarray([1, 2, 7, 3, 4, 8, 5, 6, 9], [3, 3])
```

## Installation

```javascript
$ npm install ndarray-concat-cols
```

## API

#### `require('ndarray-concat-cols')([output,] input, [options])`
**Arguments**:
- `output` (optional): An optional output destination. The shape must match the shape of the concatenated arrays, otherwise an error will be thrown. If not provided, storage will be allocated using [`ndarray-scratch`](https://github.com/scijs/ndarray-scratch).
- `input`: A javascript `Array` containing ndarrays to be concatenated. If this is missing or empty, an error will be thrown. Given n-dimensional input, all arguments must have the same dimensionality and the first n-1 dimensions of each arguments must have the same length.
- `options` (optional): An optional object containing options. Options are:
  - `dtype`: If no `output` ndarray is provided, the dtype of the output will be `double` (equivalently `float64`) by default, or otherwise the dtype specified here. See [ndarray dtypes](https://github.com/scijs/ndarray#arraydtype).

**Returns**: A reference to the output ndarray containing the concatenated data.

## License
&copy; 2016 Ricky Reusser. MIT License.

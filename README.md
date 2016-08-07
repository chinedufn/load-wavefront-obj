load-wavefront-obj [![npm version](https://badge.fury.io/js/load-wavefront-obj.svg)](http://badge.fury.io/js/load-wavefront-obj) [![Build Status](https://travis-ci.org/chinedufn/load-wavefront-obj.svg?branch=master)](https://travis-ci.org/chinedufn/load-wavefront-obj)
====================

WORK IN PROGRESS
================

> Loads the graphics buffer data from a [.obj file](https://en.wikipedia.org/wiki/Wavefront_.obj_file) that's been parsed using a [.obj parser](https://github.com/chinedufn/wavefront-obj-parser) and return a draw command that accepts options

[View demo](http://chinedufn.github.io/wavefront-obj-parser/)

## To Install

```
$ npm install --save load-wavefront-obj
```

## Running the demo locally

## API

```js
// TODO
```

### `loadWFObj(parsedWFJSON, options)` -> `object`

#### parsedWFJSON

*Required*

Type: `string`

A wavefront `.obj` file that has been parsed into JSON.

Usually you'd use [wavefront-obj-parser](https://github.com/wavefront-obj-parser) to parser the `.obj` file pre-runtime


### Returned Object

Returns a `model` object with a `draw` command

#### `model.draw([options])` -> `render to canvas`

```js
// TODO
```

## TODO:

- [x] Finish the first iteration of the draw function
- [ ] Demo in raw WebGL
- [ ] Demo using [regl](https://github.com/mikolalysenko/regl)
- [ ] Add tests using `require('gl')` and test against expected `.png` file fixtures. [example](https://github.com/msfeldstein/interactive-shader-format-js/blob/v2/tests/renderer-test.js)

## See Also

- [wavefront-obj-parser](https://github.com/chinedufn/wavefront-obj-parser)
- [collada-dae-parser](https://github.com/chinedufn/collada-dae-parser)

## License

MIT

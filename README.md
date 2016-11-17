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

// TODO

## Usage

```js
var loadWFObj = require('load-wavefront-obj')

// You would usually parse your .obj files before runtime and then `xhr` GET request the pre-parsed JSON
var parseWFObj = require('wavefront-obj-parser')
var modelJSON = parseWFObj(GetWavefrontFileSomehow())

var gl = GetCanvasWebGLContextSomehow()

// This can be a DOM image element or a Uint8Array of pixel data
var image = document.getElementById('some-already-loaded-image')

var model = loadWFObj(gl, modelJSON, {texureImage: image})

// Later inside of your render function
model.draw({position: [0, -1, -5]})
```

See something broken, confusing or ripe for improvement? Feel free to open an issue or PR!

## API

### `loadWFObj(parsedWFJSON, options)` -> `object`

#### parsedWFJSON

*Required*

Type: `string`

A wavefront `.obj` file that has been parsed into JSON.

Usually you'd use [wavefront-obj-parser](https://github.com/wavefront-obj-parser) to parser the `.obj` file pre-runtime.
But any parser that outputs the same format will do.

#### Options

*Optional*

type: `object`

`load-wavefront-obj` comes with default options, but you'll likely want to override some.

```js
var myOptions = {
  textureImage: document.getElementById('some-already-loaded-image') || new Uint8Array([255, 0, 0, 255])
}
```

##### textureImage

*type* `HTMLImageElement` or `Uint8Array`

You pass in an [HTMLImageElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement) or [Uint8Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) for your model's texture

If using an image element, make sure that the onload event has already fired

```js
// example of loading the image
var image = document.getElementById('my-image') || new window.Image()
image.src = 'https://cool-image-texture.com/cool-image.jpg'
image.onload = function () {
  loadWFObj(gl, modelJSON, {textureImage: image})
}
```

### Returned Model Object

We return a `model` object with a `draw` function

#### `model.draw([options])` -> `render to canvas`

##### Options

```js
// Example overrides
var myOptions = {
  perspective: require('gl-mat4/perspective')([], Math.PI / 3, 512 / 512, 0.1, 30),
  position: [5.0, 1.0, -20.0],
  viewMatrix: [1, 0, 0, 0, 1, 0, 0, 0, 1, 10, 10, 10, 1]
}
```

###### perspective

Type: [mat4](https://github.com/stackgl/gl-mat4)

Default: `mat4Perspective([], Math.PI / 4, 256 / 256, 0.1, 100)`

Your perspective matrix

###### position

Type: `Array`

Default: `[0.0, 0.0, -5.0]`

The x, y and z position of your model in the world.

###### viewMatrix

Type: 'Array'

Default: `[1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1]` (Identity Matrix)

Your camera's view matrix

## TODO:

- [x] Finish the first iteration of the draw function
- [ ] Demo in raw WebGL
- [ ] Demo using [regl](https://github.com/mikolalysenko/regl)
- [ ] Add tests using `require('gl')` and test against expected `.png` file fixtures. [example](https://github.com/msfeldstein/interactive-shader-format-js/blob/v2/tests/renderer-test.js)

## To Test:

*The test suite requires [imagemagick](http://www.imagemagick.org/script/index.php) to be installed locally*

```sh
$ npm run test
```

## See Also

- [wavefront-obj-parser](https://github.com/chinedufn/wavefront-obj-parser)
- [collada-dae-parser](https://github.com/chinedufn/collada-dae-parser)

## License

MIT

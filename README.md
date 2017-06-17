load-wavefront-obj [![npm version](https://badge.fury.io/js/load-wavefront-obj.svg)](http://badge.fury.io/js/load-wavefront-obj) [![Build Status](https://travis-ci.org/chinedufn/load-wavefront-obj.svg?branch=master)](https://travis-ci.org/chinedufn/load-wavefront-obj)
====================

STILL VERY MUCH A WORK IN PROGRESS
================

> Loads the graphics buffer data from a [.obj file](https://en.wikipedia.org/wiki/Wavefront_.obj_file) that's been parsed using a [.obj parser](https://github.com/chinedufn/wavefront-obj-parser) and return a draw command that accepts options

[View demo](http://chinedufn.github.io/wavefront-obj-parser/)

## To Install

```
$ npm install --save load-wavefront-obj
```

## Tutorials

- [Drawing a rotating 3D airplane model](http://www.chinedufn.com/webgl-step-by-step-load-wavefront-obj)

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
model.draw({
  attributes: model.attributes,
  uniforms: {
    // Specify your uniforms
    uAmbientColor: [1.0, 1.0, 1.0],
    // ...
  }
})
```

See something broken, confusing or ripe for improvement? Feel free to open an issue or PR!

## API

### `var model = loadWFObj(parsedWFJSON, options)` -> `object`

#### parsedWFJSON

*Required*

Type: `string`

A wavefront `.obj` file that has been parsed into JSON.

Usually you'd use [wavefront-obj-parser](https://github.com/wavefront-obj-parser) to parser the `.obj` file pre-runtime.
But any parser that outputs the same format will do.

#### Options

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

#### model

// lorem ipsum

## TODO:

- [x] Finish the first iteration of the draw function
- [ ] Demo in raw WebGL
- [ ] Demo using [regl](https://github.com/mikolalysenko/regl)
- [ ] Write Documentation
- [ ] Add tests using `require('gl')` and test against expected `.png` file fixtures. [example](https://github.com/msfeldstein/interactive-shader-format-js/blob/v2/tests/renderer-test.js)

## To Test:

*The test suite requires [imagemagick](http://www.imagemagick.org/script/index.php) to be installed locally*

```sh
$ npm run test
```

## See Also

- [wavefront-obj-parser](https://github.com/chinedufn/wavefront-obj-parser)
- [collada-dae-parser](https://github.com/chinedufn/collada-dae-parser)
- [load-collada-dae](https://github.com/chinedufn/load-collada-dae)

## License

MIT

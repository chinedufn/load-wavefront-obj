var test = require('tape')
var loadWFObj = require('../')

var fs = require('fs')

var width = 256
var height = 256
var createContext = require('gl')
// var getPixels = require('get-pixels')

var ndarray = require('ndarray')
var savePixels = require('save-pixels')

// TODO: Work in progress...
test('Cube model with positions, texture, and normals', function (t) {
  t.plan(1)

  var texturedCubeJSON = JSON.parse(fs.readFileSync('./fixture/textured-cube.json'))
  var gl = createContext(width, height)
  gl.clearColor(0, 0, 0, 1)
  gl.enable(gl.DEPTH_TEST)
  gl.viewport(0, 0, width, height)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

  var imageData = new Uint8Array(width * height * 4)
  for (var i = 0; i < height; ++i) {
    for (var j = 0; j < width; ++j) {
      imageData[width * i + (4 * j)] = (i + j) % 255
      imageData[width * i + (4 * j)] = 255
      imageData[width * i + (4 * j) + 1] = (i + j) % 255
      imageData[width * i + (4 * j) + 2] = (i + j) % 255
      imageData[width * i + (4 * j) + 3] = 255
    }
  }

  var model = loadWFObj(gl, texturedCubeJSON, {textureImage: imageData})
  model.draw()

  var pixels = new Uint8Array(width * height * 4)
  gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels)
  var nd = ndarray(pixels, [width, height, 4])
  savePixels(nd, 'png').pipe(require('fs').createWriteStream('./foo.png'))

  t.ok(true)
})

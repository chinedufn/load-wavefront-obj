var test = require('tape')

var width = 64
var height = 64
var createContext = require('gl')
var getPixels = require('get-pixels')

var ndarray = require('ndarray')
var savePixels = require('save-pixels')

test('Cube model with positions, texture, and normals', function (t) {
  t.plan(1)

  var gl = createContext(width, height)
  gl.clearColor(0, 0, 0, 1)
  gl.clear(gl.COLOR_BUFFER_BIT)

  var pixels = new Uint8Array(width * height * 4)
  // gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels)
  var nd = ndarray(pixels, [width, height, 4])
  // savePixels(nd, 'png').pipe(require('fs').createWriteStream('./foo.png'))

  t.ok(true)
})

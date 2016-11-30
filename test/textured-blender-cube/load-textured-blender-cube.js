var test = require('tape')
var loadWFObj = require('../../')

var fs = require('fs')
var path = require('path')

var createContext = require('gl')

var ndarray = require('ndarray')
var savePixels = require('save-pixels')
var imageDiff = require('image-diff')

// TODO: Work in progress...
test('Cube model with positions, texture, and normals', function (t) {
  t.plan(2)
  var canvasWidth = 256
  var canvasHeight = 256

  var gl = createContext(canvasWidth, canvasHeight)
  gl.clearColor(0, 0, 0, 1)
  gl.enable(gl.DEPTH_TEST)
  gl.viewport(0, 0, canvasWidth, canvasHeight)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

  var imageData = new Uint8Array(canvasWidth * canvasHeight * 4)
  for (var i = 0; i < canvasHeight; ++i) {
    for (var j = 0; j < canvasWidth; ++j) {
      imageData[canvasWidth * i + (4 * j)] = (i + j) % 255
      imageData[canvasWidth * i + (4 * j)] = 255
      imageData[canvasWidth * i + (4 * j) + 1] = (i + j) % 255
      imageData[canvasWidth * i + (4 * j) + 2] = (i + j) % 255
      imageData[canvasWidth * i + (4 * j) + 3] = 255
    }
  }

  // Load and draw our wavefront model
  var texturedCubeJSON = JSON.parse(fs.readFileSync(path.resolve(__dirname, './fixture/textured-cube.json')))
  var model = loadWFObj(gl, texturedCubeJSON, {textureImage: imageData})
  model.draw({rotationZ: Math.PI / 2})

  // Get our pixels from our canvas drawinf
  var pixels = new Uint8Array(canvasWidth * canvasHeight * 4)
  gl.readPixels(0, 0, canvasWidth, canvasHeight, gl.RGBA, gl.UNSIGNED_BYTE, pixels)
  var nd = ndarray(pixels, [canvasWidth, canvasHeight, 4])

  // Save the model that we just drew so that we can test it against our expected model
  savePixels(nd, 'png').pipe(fs.createWriteStream(path.resolve(__dirname, './tmp-actual.png')))

  // Test that our actual rendered model matches our expected model fixture
  imageDiff({
    actualImage: path.resolve(__dirname, './tmp-actual.png'),
    expectedImage: path.resolve(__dirname, './expected-textured-cube.png')
  }, function (err, imagesAreSame) {
    t.notOk(err, 'No error while comparing images')
    t.ok(imagesAreSame, 'Successfully rendered our textured blender cube')

    // Delete our actual newly generated test cube
    fs.unlinkSync(path.resolve(__dirname, './tmp-actual.png'))
  })
})

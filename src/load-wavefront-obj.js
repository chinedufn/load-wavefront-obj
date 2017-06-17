var dedupeVertexIndices = require('./dedupe-vertex-indices.js')
var createFragmentShader = require('./shader/create-fragment-shader.js')
var createVertexShader = require('./shader/create-vertex-shader.js')
var createShaderProgram = require('create-shader-program')
var initTexture = require('./texture/init-texture.js')

var createDrawFunction = require('create-draw-function')

module.exports = LoadWavefrontObj

function LoadWavefrontObj (gl, modelJSON, opts) {
  var expandedVertexData = dedupeVertexIndices(modelJSON)

  var vertexPositionIndexBuffer = createBuffer(gl, 'ELEMENT_ARRAY_BUFFER', Uint16Array, expandedVertexData.positionIndices)

  var numIndices = expandedVertexData.positionIndices.length

  var shader = createShaderProgram(
    gl,
    (opts.createVertexShader || createVertexShader)(opts),
    (opts.createFragmentShader || createFragmentShader)(opts)
  )
  var modelTexture = initTexture(gl, opts)

  return {
    draw: createDrawFunction(gl, shader.program, shader.attributes, shader.uniforms, vertexPositionIndexBuffer, numIndices, [modelTexture]),
    attributes: {
      aVertexPosition: createBuffer(gl, 'ARRAY_BUFFER', Float32Array, expandedVertexData.positions),
      aVertexNormal: createBuffer(gl, 'ARRAY_BUFFER', Float32Array, expandedVertexData.normals),
      aTextureCoord: createBuffer(gl, 'ARRAY_BUFFER', Float32Array, expandedVertexData.uvs)
    },
    shader: shader
  }
}

function createBuffer (gl, bufferType, DataType, data) {
  var buffer = gl.createBuffer()
  gl.bindBuffer(gl[bufferType], buffer)
  gl.bufferData(gl[bufferType], new DataType(data), gl.STATIC_DRAW)
  return buffer
}

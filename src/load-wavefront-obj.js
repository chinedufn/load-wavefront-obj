var dedupeVertexIndices = require('./dedupe-vertex-indices.js')
var initShader = require('./shader/init-shader.js')
var initTexture = require('./texture/init-texture.js')

var mat4Create = require('gl-mat4/create')
var mat4Multiply = require('gl-mat4/multiply')
var mat4Translate = require('gl-mat4/translate')

var extend = require('xtend')

var mat3NormalFromMat4 = require('gl-mat3/normalFromMat4')

module.exports = LoadWavefrontObj

function LoadWavefrontObj (gl, opts) {
  var expandedVertexData = dedupeVertexIndices(opts.modelJSON)

  var vertexPositionBuffer = createBuffer(gl, 'ARRAY_BUFFER', Float32Array, expandedVertexData.positions)
  var vertexPositionIndexBuffer = createBuffer(gl, 'ELEMENT_ARRAY_BUFFER', Uint16Array, expandedVertexData.positionIndices)
  var vertexTextureBuffer = createBuffer(gl, 'ARRAY_BUFFER', Float32Array, expandedVertexData.uvs)
  var vertexNormalBuffer = createBuffer(gl, 'ARRAY_BUFFER', Float32Array, expandedVertexData.normals)

  var numIndices = expandedVertexData.positionIndices.length

  var shaderObj = initShader(gl)
  var textureObj = initTexture(gl, opts)

  var defaults = {
    viewMatrix: mat4Create(),
    position: [0.0, -1.0, -10.0]
  }

  return {
    draw: draw
  }

  // TODO: Pull out into own file
  function draw (gl, opts) {
    opts = extend(defaults, opts)

    var modelMatrix = mat4Create()
    var modelPosition = opts.position
    mat4Translate(modelMatrix, modelMatrix, modelPosition)
    mat4Multiply(modelMatrix, opts.viewMatrix, modelMatrix)

    // TODO: Should the consumer be in charge of `useProgram` and we just return the shaderProgram during model init?
    gl.useProgram(shaderObj.program)

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer)
    gl.vertexAttribPointer(shaderObj.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0)

    // Textures
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexTextureBuffer)
    gl.vertexAttribPointer(shaderObj.textureCoordAttribute, 2, gl.FLOAT, false, 0, 0)

    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, textureObj.textures[0])
    gl.uniform1i(shaderObj.samplerUniform, 0)

    // Normals
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexNormalBuffer)
    gl.vertexAttribPointer(shaderObj.vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0)

    var normalMatrix = []
    mat3NormalFromMat4(normalMatrix, modelMatrix)
    gl.uniformMatrix3fv(shaderObj.nMatrixUniform, false, normalMatrix)

    // Lighting
    gl.uniform3f(shaderObj.ambientColorUniform, 1.0, 0.3, 0.3)

    // Drawing the model
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vertexPositionIndexBuffer)

    gl.uniformMatrix4fv(shaderObj.pMatrixUniform, false, opts.pMatrix)
    gl.uniformMatrix4fv(shaderObj.mvMatrixUniform, false, modelMatrix)

    gl.drawElements(gl.TRIANGLES, numIndices, gl.UNSIGNED_SHORT, 0)
  }
}

function createBuffer (gl, bufferType, DataType, data) {
  var buffer = gl.createBuffer()
  gl.bindBuffer(gl[bufferType], buffer)
  gl.bufferDatd(gl[bufferType], new DataType(data), gl.STATIC_DRAW)
}

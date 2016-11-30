var dedupeVertexIndices = require('./dedupe-vertex-indices.js')
var initShader = require('./shader/init-shader.js')
var initTexture = require('./texture/init-texture.js')

var mat4Create = require('gl-mat4/create')
var mat4Multiply = require('gl-mat4/multiply')
var mat4RotateX = require('gl-mat4/rotateX')
var mat4RotateY = require('gl-mat4/rotateY')
var mat4RotateZ = require('gl-mat4/rotateZ')
var mat4Translate = require('gl-mat4/translate')
var mat4Perspective = require('gl-mat4/perspective')

var extend = require('xtend')

var mat3NormalFromMat4 = require('gl-mat3/normal-from-mat4')

module.exports = LoadWavefrontObj

function LoadWavefrontObj (gl, modelJSON, opts) {
  var expandedVertexData = dedupeVertexIndices(modelJSON)

  var vertexPositionBuffer = createBuffer(gl, 'ARRAY_BUFFER', Float32Array, expandedVertexData.positions)
  var vertexPositionIndexBuffer = createBuffer(gl, 'ELEMENT_ARRAY_BUFFER', Uint16Array, expandedVertexData.positionIndices)
  var vertexTextureBuffer = createBuffer(gl, 'ARRAY_BUFFER', Float32Array, expandedVertexData.uvs)
  var vertexNormalBuffer = createBuffer(gl, 'ARRAY_BUFFER', Float32Array, expandedVertexData.normals)

  var numIndices = expandedVertexData.positionIndices.length

  var shaderObj = initShader(gl)
  var modelTexture = initTexture(gl, opts)

  var defaults = {
    ambient: [1.0, 1.0, 1.0],
    perspective: mat4Perspective([], Math.PI / 4, 256 / 256, 0.1, 100),
    position: [0.0, 0.0, -5.0],
    // Rotate the model in place
    rotateX: 0.0,
    rotateY: 0.0,
    rotateZ: 0.0,
    viewMatrix: mat4Create()
  }

  return {
    draw: draw.bind(null, gl)
  }

  // TODO: Pull out into own file
  // TODO: Add test for drawing 2 models with different number of vertex attribute arrays
  //        Make sure we enable and disable properly. Adding this in without tests for now..
  function draw (gl, opts) {
    opts = extend(defaults, opts)

    var modelMatrix = mat4Create()
    mat4Translate(modelMatrix, modelMatrix, opts.position)

    // We rotate the model in place. If you want to rotate it about an axis
    //  you can handle that by letting the consumer of this module manipulate
    //  the model's position occordingly
    mat4RotateX(modelMatrix, modelMatrix, opts.rotateX)
    mat4RotateY(modelMatrix, modelMatrix, opts.rotateY)
    mat4RotateZ(modelMatrix, modelMatrix, opts.rotateZ)

    mat4Multiply(modelMatrix, opts.viewMatrix, modelMatrix)

    // TODO: Should the consumer be in charge of `useProgram` and we just return the shaderProgram during model init?
    gl.useProgram(shaderObj.program)

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer)
    gl.enableVertexAttribArray(shaderObj.vertexPositionAttribute)
    gl.vertexAttribPointer(shaderObj.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0)

    // Textures
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexTextureBuffer)
    gl.enableVertexAttribArray(shaderObj.textureCoordAttribute)
    gl.vertexAttribPointer(shaderObj.textureCoordAttribute, 2, gl.FLOAT, false, 0, 0)

    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, modelTexture)
    gl.uniform1i(shaderObj.samplerUniform, 0)

    // Normals
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexNormalBuffer)
    gl.enableVertexAttribArray(shaderObj.vertexNormalAttribute)
    gl.vertexAttribPointer(shaderObj.vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0)

    var normalMatrix = []
    mat3NormalFromMat4(normalMatrix, modelMatrix)
    gl.uniformMatrix3fv(shaderObj.nMatrixUniform, false, normalMatrix)

    // Lighting
    gl.uniform3fv(shaderObj.ambientColorUniform, opts.ambient)

    // Drawing the model
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vertexPositionIndexBuffer)

    gl.uniformMatrix4fv(shaderObj.pMatrixUniform, false, opts.perspective)
    gl.uniformMatrix4fv(shaderObj.mvMatrixUniform, false, modelMatrix)

    gl.drawElements(gl.TRIANGLES, numIndices, gl.UNSIGNED_SHORT, 0)

    // Clean up
    gl.disableVertexAttribArray(shaderObj.vertexPositionAttribute)
    gl.disableVertexAttribArray(shaderObj.textureCoordAttribute)
    gl.disableVertexAttribArray(shaderObj.vertexNormalAttribute)
  }
}

function createBuffer (gl, bufferType, DataType, data) {
  var buffer = gl.createBuffer()
  gl.bindBuffer(gl[bufferType], buffer)
  gl.bufferData(gl[bufferType], new DataType(data), gl.STATIC_DRAW)
  return buffer
}

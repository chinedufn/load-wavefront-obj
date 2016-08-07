var createFragmentShader = require('./create-fragment-shader.js')
var createVertexShader = require('./create-vertex-shader.js')

module.exports = InitShader

// TODO: Pull out into separate, tested shader generator repository
function InitShader (gl, opts) {
  var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
  gl.shaderSource(fragmentShader, createFragmentShader(opts))
  gl.compileShader(fragmentShader)

  var vertexShader = gl.createShader(gl.VERTEX_SHADER)
  gl.shaderSource(vertexShader, createVertexShader(opts))
  gl.compileShader(vertexShader)

  var shaderProgram = gl.createProgram()
  gl.attachShader(shaderProgram, fragmentShader)
  gl.attachShader(shaderProgram, vertexShader)
  gl.linkProgram(shaderProgram)

  // Return our shader data object
  return {
    ambientColorUniform: gl.getUniformLocation(shaderProgram, 'uAmbientColor'),
    mvMatrixUniform: gl.getUniformLocation(shaderProgram, 'uMVMatrix'),
    nMatrixUniform: gl.getUniformLocation(shaderProgram, 'uNMatrix'),
    pMatrixUniform: gl.getUniformLocation(shaderProgram, 'uPMatrix'),
    program: shaderProgram,
    samplerUniform: gl.getUniformLocation(shaderProgram, 'uSampler'),
    textureCoordAttribute: gl.getAttribLocation(shaderProgram, 'aTextureCoord'),
    vertexPositionAttribute: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
    vertexNormalAttribute: gl.getAttribLocation(shaderProgram, 'aVertexNormal')
  }
}

var dedupeVertexIndices = require('./dedupe-vertex-indices.js')

module.exports = LoadWavefrontObj

function LoadWavefrontObj (gl, opts) {
  var expandedVertexData = dedupeVertexIndices(opts.modelJSON)

  var vertexPositionBuffer = createBuffer(gl, 'ARRAY_BUFFER', Float32Array, expandedVertexData.positions)
  var vertexPositionIndexBuffer = createBuffer(gl, 'ELEMENT_ARRAY_BUFFER', Uint16Array, expandedVertexData.positionIndices)
  // var vertexTextureBuffer = createBuffer(gl, 'ARRAY_BUFFER', Float32Array, expandedVertexData.uvs)
  var vertexNormalBuffer = createBuffer(gl, 'ARRAY_BUFFER', Float32Array, expandedVertexData.normals)

  return {
    draw: draw
  }

  function draw (gl, opts) {
    // TODO: Should the consumer be in charge of `useProgram` and we just return the shaderProgram during model init?
    gl.useProgram(shaderObj.program)
  }
}

function createBuffer (gl, bufferType, DataType, data) {
  var buffer = gl.createBuffer()
  gl.bindBuffer(gl[bufferType], buffer)
  gl.bufferDatd(gl[bufferType], new DataType(data), gl.STATIC_DRAW)
}

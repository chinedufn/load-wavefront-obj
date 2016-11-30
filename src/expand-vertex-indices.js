module.exports = ExpandVertexPositionIndices

// TODO: Pull out into own repo. The collada loader will use this also
//
// Expands .obj faces with two triangles into 6 indices instead of the decoded 4 indices
//  example: f 1/20/30 2/30/40 3/40/50 4/50/60
//           gets expanded into [1, 2, 3, 1, 2, 4]
//
//           but 1/20/30 2/30/40 3/40/50 would not get expanded
//           it becomes [1, 2, 3]
//
function ExpandVertexPositionIndices (modelJSON) {
  var decodedVertexPositionIndices = []
  var decodedVertexUVIndices = []
  var decodedVertexNormalIndices = []

  for (var i = 0; i < modelJSON.vertexIndex.length / 4; i++) {
    decodedVertexPositionIndices.push(modelJSON.vertexIndex[i * 4])
    decodedVertexPositionIndices.push(modelJSON.vertexIndex[i * 4 + 1])
    decodedVertexPositionIndices.push(modelJSON.vertexIndex[i * 4 + 2])
    decodedVertexUVIndices.push(modelJSON.uvIndex[i * 4])
    decodedVertexUVIndices.push(modelJSON.uvIndex[i * 4 + 1])
    decodedVertexUVIndices.push(modelJSON.uvIndex[i * 4 + 2])
    decodedVertexNormalIndices.push(modelJSON.normalIndex[i * 4])
    decodedVertexNormalIndices.push(modelJSON.normalIndex[i * 4 + 1])
    decodedVertexNormalIndices.push(modelJSON.normalIndex[i * 4 + 2])
    // If this is a face with 4 vertices we push a second triangle
    if (decodedVertexPositionIndices[i * 4 + 3] !== -1) {
      decodedVertexPositionIndices.push(modelJSON.vertexIndex[i * 4])
      decodedVertexPositionIndices.push(modelJSON.vertexIndex[i * 4 + 2])
      decodedVertexPositionIndices.push(modelJSON.vertexIndex[i * 4 + 3])
      decodedVertexUVIndices.push(modelJSON.uvIndex[i * 4])
      decodedVertexUVIndices.push(modelJSON.uvIndex[i * 4 + 2])
      decodedVertexUVIndices.push(modelJSON.uvIndex[i * 4 + 3])
      decodedVertexNormalIndices.push(modelJSON.normalIndex[i * 4])
      decodedVertexNormalIndices.push(modelJSON.normalIndex[i * 4 + 2])
      decodedVertexNormalIndices.push(modelJSON.normalIndex[i * 4 + 3])
    }
  }
  return {
    decodedPositionIndices: decodedVertexPositionIndices,
    decodedUVIndices: decodedVertexUVIndices,
    decodedNormalIndices: decodedVertexNormalIndices
  }
}

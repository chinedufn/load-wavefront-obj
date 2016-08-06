module.exports = ExpandVertexIndices

// TODO: Pull out into own repo. The collada loader will use this also
//
// Expands .obj faces with two triangles into 6 indices instead of the encoded 4 indices
//  example: f 1/20/30 2/30/40 3/40/50 4/50/60
//           gets expanded into [1, 2, 3, 1, 2, 4]
//
//           but 1/20/30 2/30/40 3/40/50 would not get expanded
//           it becomes [1, 2, 3]
//
function ExpandVertexIndices (encodedVertexIndices) {
  var decodedVertexIndices = []
  for (var i = 0; i < encodedVertexIndices.length / 4; i++) {
    decodedVertexIndices.push(encodedVertexIndices[i * 4])
    decodedVertexIndices.push(encodedVertexIndices[i * 4 + 1])
    decodedVertexIndices.push(encodedVertexIndices[i * 4 + 2])
    // If this is a face with 4 vertices we push a second triangle
    if (encodedVertexIndices[i * 4 + 3] !== -1) {
      decodedVertexIndices.push(encodedVertexIndices[i * 4])
      decodedVertexIndices.push(encodedVertexIndices[i * 4 + 2])
      decodedVertexIndices.push(encodedVertexIndices[i * 4 + 3])
    }
  }
  return decodedVertexIndices
}

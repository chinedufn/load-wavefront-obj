var expandVertexIndices = require('./expand-vertex-indices.js')

module.exports = DedupeVertexIndices

// TODO: Pull into own repo. The collada loader will use this also
// TODO: The way that we're doing this is inefficient and so we'll want to write a
//        few tests when we pull this out into it's own repo
//        ex: We don't need to dedupe indices that are pointing to the same exact data
//
// Dedupe vertex indices and duplicate the associated position / uv / normal data
// Since we can't have multiple VBO indexes we need to expand out our indexed data
function DedupeVertexIndices (modelJSON) {
  var expandedVertexPositions = modelJSON.vertex
  var expandedVertexUVs = []
  var expandedVertexNormals = []
  var expandedVertexPositionIndices = []
  var encounteredIndices = {}
  var largestPositionIndex = 0

  var decodedIndices = expandVertexIndices(modelJSON)

  decodedIndices.decodedPositionIndices.forEach(function (vertexIndex, counter) {
    largestPositionIndex = Math.max(largestPositionIndex, vertexIndex)
    // If this is our first time seeing the vertex index we add it
    // Later we'll add all of the duplicate indices into the end of the array
    if (!encounteredIndices[vertexIndex]) {
      expandedVertexPositionIndices[counter] = vertexIndex
      // Push the appropriate UV coordinates
      for (var i = 0; i < 3; i++) {
        if (i < 2) {
          expandedVertexUVs[vertexIndex * 2 + i] = modelJSON.uv[decodedIndices.decodedUVIndices[counter] * 2 + i]
        }
        expandedVertexNormals[vertexIndex * 3 + i] = modelJSON.normal[decodedIndices.decodedNormalIndices[counter] * 3 + i]
      }
      encounteredIndices[vertexIndex] = true
    }
  })
  decodedIndices.decodedPositionIndices.forEach(function (vertexIndex, counter) {
    // Add all of the duplicate indices that we skipped over above
    if (encounteredIndices[vertexIndex]) {
      expandedVertexPositionIndices[counter] = ++largestPositionIndex
      for (var i = 0; i < 3; i++) {
        if (i < 2) {
          expandedVertexUVs[largestPositionIndex * 2 + i] = modelJSON.uv[decodedIndices.decodedUVIndices[counter] * 2 + i]
        }
        expandedVertexPositions[largestPositionIndex * 3 + i] = modelJSON.vertex[vertexIndex * 3 + i]
        expandedVertexNormals[largestPositionIndex * 3 + i] = modelJSON.normal[decodedIndices.decodedNormalIndices[counter] * 3 + i]
      }
    }
  })

  return {
    positions: expandedVertexPositions,
    positionIndices: expandedVertexPositionIndices,
    normals: expandedVertexNormals,
    uvs: expandedVertexUVs
  }
}

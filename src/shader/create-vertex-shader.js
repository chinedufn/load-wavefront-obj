module.exports = CreateVertexShader

function CreateVertexShader (opts) {
  return `
    attribute vec3 aVertexPosition;

    attribute vec3 aVertexNormal;
    uniform mat3 uNMatrix;

    attribute vec2 aTextureCoord;
    varying vec2 vTextureCoord;

    uniform vec3 uAmbientColor;
    varying vec3 vLightWeighting;

    uniform mat4 uMVMatrix;
    uniform mat4 uPMatrix;

    void main (void) {
      gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
      vTextureCoord = aTextureCoord;

      vec3 transformedNormal = uNMatrix * aVertexNormal;
      vLightWeighting = uAmbientColor;
    }
  `
}

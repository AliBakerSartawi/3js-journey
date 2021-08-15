uniform vec2 uFrequency;
uniform float uTime;

varying vec2 vUV;
varying float vElevation;


// main is called automatically, and is void
void main() {

  // ignore modelMatrix error, as it is automatically imported in ShaderMaterial
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  float elevation = sin(modelPosition.x * uFrequency.x + uTime) * 0.1;
  elevation += sin(modelPosition.y * uFrequency.y + uTime) * 0.1;
  modelPosition.z = elevation;

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;

  vUV = uv;
  vElevation = elevation;
}
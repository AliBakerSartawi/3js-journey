uniform float uBigWavesElevation;
uniform float uTime;

// uBigWavesFrequency.y is the z axis, it's a vec2 so we have to call it y
uniform vec2 uBigWavesFrequency;
uniform float uBigWavesSpeed;

varying vec2 vUV;
varying float vElevation;

void main() {

  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  // Elevation
  float elevation = 
    sin(modelPosition.x * uBigWavesFrequency.x + (uTime * uBigWavesSpeed)) * 
    sin(modelPosition.z * uBigWavesFrequency.y + (uTime * uBigWavesSpeed)) * 
    uBigWavesElevation;

  modelPosition.y += elevation;

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectionPosition = projectionMatrix * viewPosition;

  gl_Position = projectionPosition;

  // Varyings
  vUV = uv;
  vElevation = elevation;
}
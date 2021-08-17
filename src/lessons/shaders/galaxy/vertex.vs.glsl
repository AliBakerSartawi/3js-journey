uniform float uSize;
uniform bool uSizeAttenuation;

attribute float aRandomScale;

varying vec3 vColor;

void main() {
  // position
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectionPosition = projectionMatrix * viewPosition;
  gl_Position = projectionPosition;

  /*
   * Size
   */
  gl_PointSize = uSize * aRandomScale;
  // // enable sizeAttenuation
  // viewPosition can also be called modelViewPosition
  if (uSizeAttenuation) gl_PointSize *= ( 1.0 / - viewPosition.z);
  

  // Varyings
  vColor = color; // color is the default attribute from the custom geometry
}
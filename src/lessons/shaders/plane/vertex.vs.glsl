uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;

// retreiving position value from geometry
// the same position attribute provided in the buffer
attribute vec3 position;

// main is called automatically, and is void
void main() {

  /* 
   * gl_Position 
   * this variable already exists, we only reassign it
   * determines the vertex's position in the render  
   * returns a vec4
   * x, y, z are responsible for 3D position
   * w is responsibe for persepective (homogeneous coordinates)
   */
  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
}
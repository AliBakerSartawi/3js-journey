
/* 
 * each matrix will transform the position until we get
 * the final clip space coordinates
 * 
 * they are uniforms because they are the same for all vertices
 * each matrix does a part in the transformation
 * to apply a matrix, we multiply it
 * must have the same size as coordinates (mat4 for vec4)
 *
 * modelMatrix       => apply transformations relative to the mesh
 *                   => (position, rotation, scale)
 *
 * viewMatrix        => apply transformations relative to the camera
 *                   => (position, rotation, field of view, near, far)
 *
 * projectionMatrix  => transform the coordinates into the clip space coordinates
 */
uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

/*
 * retreiving position value from geometry
 * the same position attribute provided in the float array
 * geo.setAttribute('position', positionsAttribute)
 */
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
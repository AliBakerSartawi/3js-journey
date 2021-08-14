/**
 * GLSL Rules:
 * 
 * close to C language
 * you can't log anything
 * semicolons are a must
 * variables are typed
 *    - 🟢 float fooBar = 0.1212;
 *    - 🟢 float fooBar = 1.0; => must always have decimals
 *    - 🔴 float fooBar = 1;
 */ 

export const planeShaders = {
  vertexShader: `
    uniform mat4 projectionMatrix;
    uniform mat4 viewMatrix;
    uniform mat4 modelMatrix;

    attribute vec3 position;

    void main() {
      gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    precision mediump float;

    void main() {
      gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
  `
}
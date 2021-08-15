// we can even get rid of (precision mediump float) in ShaderMaterial but not in RawShaderMaterial
precision mediump float;

// uniforms can be retrieved automatically in fragShaders
uniform vec3 uColor;
uniform float uAlpha;
// sampler2D is a very specific type for textures
uniform sampler2D uTexture;
uniform bool uNormals;
uniform bool uNormals2;

// uv || vUV is the coordinates where the color takes place
varying vec2 vUV;
varying float vElevation;

void main() {
  // for texture2D, we need the texture, and the position
  vec4 textureColor = texture2D(uTexture, vUV);

  // mimic shadows (make closer brighter)
  textureColor.rgb += vElevation;
  // textureColor.rgb += vElevation * 2.0 + 0.5;

  // add color tint
  textureColor.rgb += uColor;

  // textureColor.rgb || .xyz => returns a vec3
  // gl_FragColor = vec4(textureColor.rgb, uAlpha);

  // gl_FragColor = vec4(uColor, uAlpha);

  // nice normals color effect
  // gl_FragColor = vec4(1.0, vUV, uAlpha);
  // gl_FragColor = vec4(vUV, 1.0, uAlpha);

  if (uNormals && uNormals2) {
    gl_FragColor = vec4(vUV.x, 1.0, vUV.y, uAlpha);
  } else if (uNormals) {
    gl_FragColor = vec4(vUV, 1.0, uAlpha);
  } else if (uNormals2) {
    gl_FragColor = vec4(1.0, vUV, uAlpha);
  } else {
    gl_FragColor = vec4(textureColor.rgb, uAlpha);
  }
}
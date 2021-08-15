// we can even get rid of (precision mediump float) in ShaderMaterial but not in RawShaderMaterial
precision mediump float;

uniform float uAlpha;

void main() {
    gl_FragColor = vec4(1.0, 0.0, 1.0, uAlpha);
}
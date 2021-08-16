precision mediump float;

uniform float uAlpha;

// 0.0, 0.0 bottom-left => 1.0, 1.0 top-right
// think of it like a chart ↗️
varying vec2 vUV;

void main() {

  // // pattern #1 (like normals)
  // gl_FragColor = vec4(vUV, 1.0, uAlpha);

  // // pattern #2 (no blue)
  // gl_FragColor = vec4(vUV, 0.0, uAlpha);

  // // 😲 extra pattern (half blue)
  // // gives an amazing palette
  // gl_FragColor = vec4(vUV, 0.5, uAlpha);

  // // pattern #3 (gradient black to white - horizontal)
  float strength = vUV.x;
  // gl_FragColor = vec4(vec3(strength), uAlpha);

  // // pattern #4 (gradient black to white - vertical)
  // strength = vUV.y;
  // gl_FragColor = vec4(vec3(strength), uAlpha);

  // // pattern #5 (gradient black to white - vertical reversed)
  // strength = vUV.y;
  // gl_FragColor = vec4(vec3(1.0 - strength), uAlpha);

  // // pattern #6 (gradient black to white - vertical easeIn)
  // strength = vUV.y * 10.0;

  // // pattern #7 (gradient black to white - vertical easeIn 10waves)
  // // like blinders
  // // mod(value, limit)
  // strength = mod(vUV.y * 10.0, 1.0);

  // // pattern #8 (sharp black to white - vertical 10waves intervals)
  // strength = mod(vUV.y * 10.0, 1.0);
  // // conditions are bad for GLSL performances
  // // can even work without curly brackets
  // // if (strength < 0.5) {
  // //   strength = 1.0;
  // // } else {
  // //   strength = 0.0;
  // // }
  // // or even ternary
  // // strength = strength < 0.5 ? 0.0 : 1.0;
  // // same result can be achieved with step
  // strength = step(0.5, strength);

  // // pattern #9 (sharp black to white - vertical 10waves intervals more black)
  // strength = mod(vUV.y * 10.0, 1.0);
  // strength = step(0.8, strength);

  // // pattern #9 (sharp black to white - horizontal 10waves intervals more black)
  // strength = mod(vUV.x * 10.0, 1.0);
  // strength = step(0.8, strength);

  // pattern #9 (waffle, black squares, white borders - ten intervals)
  strength = step(0.8, mod(vUV.x * 10.0, 1.0));
  strength += step(0.8, mod(vUV.y * 10.0, 1.0));

  gl_FragColor = vec4(vec3(strength), uAlpha);
}
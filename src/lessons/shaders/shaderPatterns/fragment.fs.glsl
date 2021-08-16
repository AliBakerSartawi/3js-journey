precision mediump float;

uniform float uAlpha;

// 0.0, 0.0 bottom-left => 1.0, 1.0 top-right
// think of it like a chart ↗️
varying vec2 vUV;

// thebookofshaders.com/10
// this random function will always return the same value based on passed arguments
// this function is psuedo-random, not true random
float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453132);
}

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

  // // pattern #10 (sharp black to white - horizontal 10waves intervals more black)
  // strength = mod(vUV.x * 10.0, 1.0);
  // strength = step(0.8, strength);

  // // pattern #11 (waffle, black squares, white borders - ten intervals)
  // strength = step(0.8, mod(vUV.x * 10.0, 1.0));
  // strength += step(0.8, mod(vUV.y * 10.0, 1.0));

  // // pattern #12 (square white polka dots)
  // strength = step(0.8, mod(vUV.x * 10.0, 1.0));
  // strength *= step(0.8, mod(vUV.y * 10.0, 1.0));

  // // pattern #13 (short vertical white lines)
  // strength = step(0.3, mod(vUV.x * 10.0, 1.0));
  // strength *= step(0.8, mod(vUV.y * 10.0, 1.0));

  // // pattern #14 (small top-right white corners)
  // float barX = step(0.3, mod(vUV.x * 10.0, 1.0));
  // barX *= step(0.8, mod(vUV.y * 10.0, 1.0));
  // float barY = step(0.3, mod(vUV.y * 10.0, 1.0));
  // barY *= step(0.8, mod(vUV.x * 10.0, 1.0));
  // strength = barX + barY;

  // // pattern #15 (small white plus signs)
  // float barX = step(0.3, mod(vUV.x * 10.0, 1.0));
  // barX *= step(0.8, mod(vUV.y * 10.0 + 0.25, 1.0));
  // float barY = step(0.8, mod(vUV.x * 10.0 + 0.25, 1.0));
  // barY *= step(0.3, mod(vUV.y * 10.0, 1.0));
  // strength = barX + barY;
  
  // // pattern #16 (gradient black to white - horizontal middle to side)
  // strength = abs(vUV.x - 0.5);
  
  // // pattern #17 (gradient black -ish to white - center to corners)
  // strength = min(abs(vUV.x - 0.5), abs(vUV.y - 0.5));
  
  // // pattern #18 (gradient black to white -ish - center to corners)
  // strength = max(abs(vUV.x - 0.5), abs(vUV.y - 0.5));
  
  // // pattern #19 (black window in the middle, white thick border)
  // // or think of it as white frame
  // strength = step(0.2, max(abs(vUV.x - 0.5), abs(vUV.y - 0.5)));
  
  // // pattern #20 (small black window in the middle, white small border)
  // strength = step(0.2, max(abs(vUV.x - 0.5), abs(vUV.y - 0.5)));
  // strength *= 1.0 - step(0.25, max(abs(vUV.x - 0.5), abs(vUV.y - 0.5)));
  
  // // pattern #21 (gradient black to white - horizontal steps)
  // strength = ceil(vUV.x * 10.0) / 10.0;
  // // or
  // strength = floor(vUV.x * 10.0) / 10.0;
  
  // // pattern #22 (gradient black to white - horizontal+vertical steps)
  // strength = ((floor(vUV.x * 10.0) / 10.0) + (floor(vUV.y * 10.0) / 10.0)) / 2.0;
  
  // // pattern #23 (black noise on white screen)
  // // we need to mimic a random function (method)
  // strength = random(vUV.xy); // or simply => random(vUV)
  
  // // pattern #24 (pixelated black noise on white screen - minecraft style)
  // // mixed with pattern #22
  // vec2 gridUV = vec2(
  //   (floor(vUV.x * 10.0) / 10.0), 
  //   (floor(vUV.y * 10.0) / 10.0)
  // );
  // strength = random(gridUV);
  
  // // pattern #25 (pixelated black noise on white screen - minecraft style - with offset on Y)
  // vec2 gridUV = vec2(
  //   (floor(vUV.x * 10.0) / 10.0), 
  //   (floor((vUV.y + vUV.x * 0.5) * 10.0) / 10.0)
  // );
  // strength = random(gridUV);
  
  // // pattern #26 (gradient black to white - bottom-left to top-right easeIn)
  // // length is distance from 0.0 (bottom-left)
  // strength = length(vUV);
  
  // // pattern #27 (gradient black circle in the middle to white)
  // strength = length(vUV - 0.5);
  // // or
  // // distance creates some kind of point of origin effect
  // strength = distance(vUV, vec2(0.5, 0.5));
  
  // // pattern #28 (opposite to #27)
  // strength = 1.0 - distance(vUV, vec2(0.5, 0.5));
  
  // // pattern #29 (like previous but eclipsed sun)
  // // point light effect / faraway star
  // strength = 0.015 / distance(vUV, vec2(0.5, 0.5)) - 0.1;
  
  // pattern #30 (like previous but stretched on x)
  // point light effect / faraway star
  strength = 0.015 / distance(vUV, vec2(0.5, 0.5)) - 0.1;


  gl_FragColor = vec4(vec3(strength), uAlpha);
}

import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, extend, useFrame, useLoader } from '@react-three/fiber';
import { Physics, useBox, usePlane, useSphere } from '@react-three/cannon';
import { OrbitControls, shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { folder, Leva, useControls } from 'leva';

// shader imports using raw-loader package
/* eslint-disable import/no-webpack-loader-syntax */
import vertexShader from '!!raw-loader!./shaders/plane/vertex.vs.glsl';
import fragmentShader from '!!raw-loader!./shaders/plane/fragment.fs.glsl';

// glsl import
import glsl from 'babel-plugin-glsl/macro';

/**
 * Problem importing GLSL files:
 *
 * the problem is that it is imported as a static file (like images)
 * but we need it as a string, webpack must be configured, which isn't an easy task in a react app
 *
 * the following must be added to /bundler/webpack.common.js, in the rules array
 *
 * {
 *    test: /\.(vs.glsl|fs.glsl|or any other extensions)$/,
 *    exclude: /node_modules/,
 *    use: {
 *        'raw-loader'
 *    }
 * }
 *
 * 🟢 Solution: use raw-loader package, insert !!raw-loader! before file path to override webpack configs
 *
 */

/**
 * GLSL Rules:
 *
 * - close to C language
 * - you can't log anything
 * - semicolons are a must
 * - variables are typed
 *
 * - Rules:
 *    - 🟢 float foo = 0.1212;
 *    - 🟢 float bar = 1.0; => must always have decimals
 *    - 🟢 float duh = foo * bar; // must always have decimals
 *    - 🔴 float salamander = 1;
 *    - 🟢 int cheese = 1;
 *    - 🟢 int mango = - 12;
 *    - 🟢 int yuck = cheese / mango; // but if you get a float, you're in trouble
 *    - 🔴 int salsa = 1.0;
 *    - 🔴 float mix = bar * cheese; // cannot mix int with float
 *    - 🟢 float convert = bar * float(cheese); // but can convert on the fly
 *    - 🟢 bool convinceMe = true;
 *    - 🟢 bool notConvinced = false;
 *
 *    - vec2 (to store 2 coordinates(x, y))
 *    - 🟢 vec2 sup = vec2(1.0, 2.0);
 *    - 🔴 vec2 emptyInside = vec2(); // will cause an error, unlike THREE
 *    - 🟢 vec2 mono = vec2(1.0); // will use value for x & y
 *    - 🟢 vec2 mutable = vec2(1.0); mutable.x = 2.0; mutable.y = 3.0;
 *    - 🟢 mutable *= 2.0; // will affect both x & y
 *
 *    - vec3 (to store 3 coordinates(x, y, z))
 *    - 🟢 vec3 hey = vec3(1.0);
 *    - 🟢 vec3 yo = vec3(1.0, 3.6, 4.5);
 *    - 🟢 yo.z = 9.9;
 *    - 🟢 vec3 fromVec2 = vec3(sup, 4.5);
 *    - or the opposite (called swizzle)
 *    - 🟢 vec2 fromVec3 = hey.xy; // even xz or yx, but not xg or by
 *
 *    - instead of (x, y, z), you can use (r, g, b) aliases
 *    - or even use them interchangeably on the same variable
 *    - 🟢 yo.x = 0.7;
 *    - 🟢 yo.g = 0.9;
 *    - 🟢 yo.b = 0.3;
 *
 *    - vec4 (to store 4 coordinates(x, y, z, w)) || (r, g, b, a)
 *    - 🟢 vec4 comeOn = vec4(1.0, 2.0, 3.0, 4.0);
 *    - 🟢 vec4 really = vec4(comeOn.zw, vec2(5.0, 6.0));
 *    - 🟢 float backAgain = really.a;
 *
 *    - functions are typed as well
 *    - float sum(float a, float b) { return a + b; };
 *
 *    - classic built-in functions
 *      - sin, cos, max, min, pow, exp, mod, clamp
 *
 *    - practical built-in functions
 *      - cross, dot, mix, step, smoothstep, length, distance, reflect, refract, normalize
 *
 * - Documentation: (not beginner-friendly)
 *   - https://www.shaderific.com/glsl-functions
 *   - https://www.khronos.org/registry/OpenGL-Refpages/gl4/html/indexflat.php
 *   - https://thebookofshaders.com/glossary/
 */

/**
 * Shaders
 * Written in GLSL
 *
 * GLSL => stands for openGL (Graphics Library) Shading Language
 *      => positions each vertex of a geometry
 *      => colorizes each visible pixel (fragment) of that geometry
 *      => fragments are to the renderer like pixels are to a screen
 *      => data (vertices, meshes, lights, camera, etc.) are sent to the GPU, which process them according to shader instructions
 *
 *      => Types:
 *         => Vertex Shader   => the same vertex shader code will position all vertices (runs for each vertex)
 *                            => data that differ from vertex to vertex (like vertex position & vertexColor) are called: 🟠 attributes
 *                            => data that are similar to all vertices (like mesh position & camera) are called: 🔵 uniforms
 *         => Fragment Shader => once vertices are placed, GPU knows the visible fragments and proceeds to the fragment shader
 *                            => fragment shaders only have uniforms, no attributes, but...
 *                            => data can be sent from the vertex shader, they're called: 🟣 varyings
 *                            => 🟣 varyings values are interpolated between the vertices
 *                               => for example: if each vertex has a color, the fragment will have a percentage of that color
 *                                  depending on how close it is to that vertex
 *
 *      => Why Custom Shaders => very performant
 *                            => custom post-processing (effects)
 *                            => can do what built in materials can't
 *
 *      => ShaderMaterial will have some code added to the shader
 *      => RawShaderMaterial is... raw 🤓
 *
 *      => glsl linting => https://www.youtube.com/watch?v=NQ-g6v7GtoI
 */

function BufferAttributes() {
  const buffer = useRef();

  const [array, bufferCount, itemSize] = useMemo(() => {
    // if (count) {
    const bufferCount = 1089;
    const itemSize = 1;
    const array = new Float32Array(bufferCount);

    for (let i = 0; i < bufferCount; i++) {
      array[i] = Math.random();
    }
    return [array, bufferCount, itemSize];
    // } else {
    //   return [[], 0, 0];
    // }
  }, []);

  return (
    <bufferAttribute
      ref={buffer}
      // Bruno Simon naming convention => aRandom, a for attribute
      attachObject={['attributes', 'aRandom']}
      count={bufferCount}
      array={array}
      itemSize={itemSize}
    />
  );
}

const vertexShaderString = vertexShader;
const fragmentShaderString = fragmentShader;

const PlaneShaderMaterial = shaderMaterial(
  {
    uTime: 0,
    uFrequency: new THREE.Vector2(10, 5)
  },
  glsl`
    uniform vec2 uFrequency;
    // attribute vec3 position;
    attribute float aRandom;

    // main is called automatically, and is void
    void main() {

      vec4 modelPosition = modelMatrix * vec4(position, 1.0);

      modelPosition.z += sin(modelPosition.x * uFrequency.x) * 0.1;
      modelPosition.z += sin(modelPosition.y * uFrequency.y) * 0.1;

      vec4 viewPosition = viewMatrix * modelPosition;
      vec4 projectedPosition = projectionMatrix * viewPosition;

      gl_Position = projectedPosition;

      // this reassignment can be anywhere in this function, even at the very end
      // vRandom = aRandom;
    }
  `,
  glsl`
    precision mediump float;
    void main() {
      gl_FragColor = vec4(0.5, 0.5, 1.0, 0.5);
    }
  `
);

extend({ PlaneShaderMaterial });

/**
 * Plane Component
 */
function Plane() {
  const plane = useRef();
  const shaderMaterial = useRef();

  const { uFrequencyX, uFrequencyY, transparent, wireframe } = useControls({
    ShaderFrequency: folder({
      uFrequencyX: { value: 10, min: 0, max: 100, step: 0.1 },
      uFrequencyY: { value: 5, min: 0, max: 100, step: 0.1 },
      transparent: true,
      wireframe: true,
    })
  });

  useEffect(() => {
    // plane.current.geometry.attributes.position.count => exact number of vertices
    plane.current && console.log(plane.current.geometry.attributes);
  }, [plane]);

  return (
    <mesh ref={plane} transparent={transparent}>
      <planeBufferGeometry args={[1, 1, 32, 32]}>
        <BufferAttributes />
      </planeBufferGeometry>
      {/* <rawShaderMaterial
        // putting the shaders in args prop as object causes error (argsNew.some is not a function)
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        // wireframe
        side={THREE.DoubleSide}
        transparent={transparent}
        uniforms={{
          uFrequency: { value: new THREE.Vector2(uFrequencyX, uFrequencyY) },
          uTime: { value: 0}
        }}
      /> */}
      <planeShaderMaterial
        ref={shaderMaterial}
        uFrequency={new THREE.Vector2(uFrequencyX, uFrequencyY)}
        wireframe={wireframe}
        transparent={transparent}
      />
    </mesh>
  );
}

/**
 * Main Component
 */
function Shaders() {
  const { background } = useControls({
    Background: folder({
      background: '#000000'
    })
  });

  return (
    <div style={{ height: '100vh', backgroundColor: background }}>
      <Canvas
        shadows
        camera={{
          fov: 45,
          position: [1, 0.5, 1],
          near: 0.1,
          far: 2000
        }}
      >
        <axesHelper args={[10]} />
        <OrbitControls />

        <Plane />

        <Lights />
      </Canvas>
      <Leva oneLineLabels />
    </div>
  );
}

export default Shaders;

function Lights() {
  const {
    Point_Light_Intensity: pointLightIntensity,
    Point_Light_Color: pointLightColor,
    Hemisphere_Light_Intensity: hemisphereIntensity,
    Hemisphere_Sky_Light_Color: hemisphereSkyColor,
    Hemisphere_Ground_Light_Color: hemisphereGroundColor
  } = useControls({
    Lights: folder(
      {
        Point_Light: folder(
          {
            Point_Light_Intensity: { value: 1, min: 0, max: 10, step: 0.01 },
            Point_Light_Color: '#e1e1e1'
          },
          {
            collapsed: true
          }
        ),
        Hemisphere_Light: folder(
          {
            Hemisphere_Light_Intensity: {
              value: 1,
              min: 0,
              max: 10,
              step: 0.01
            },
            Hemisphere_Sky_Light_Color: '#e1e1e1',
            Hemisphere_Ground_Light_Color: '#e1e1e1'
          },
          {
            collapsed: true
          }
        )
      },
      {
        collapsed: true
      }
    )
  });
  return (
    <>
      <hemisphereLight
        args={[hemisphereSkyColor, hemisphereGroundColor, hemisphereIntensity]}
      />
      <pointLight
        castShadow
        args={[pointLightColor, pointLightIntensity, 20, 1]}
        position={[-5, 5, 5]}
      />
    </>
  );
}

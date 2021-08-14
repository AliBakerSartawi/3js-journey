import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { Physics, useBox, usePlane, useSphere } from '@react-three/cannon';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { folder, Leva, useControls } from 'leva';
// import glsl from 'babel-plugin-glsl'
// console.log(glsl)

// shader imports
import vertexShader from './shaders/plane/vertex.glsl'
console.log(vertexShader)


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
 */

const planeShaders = {
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

/**
 * Plane Component
 */
function Plane() {
  return (
    <mesh>
      <planeBufferGeometry args={[10, 10]} />
      <meshBasicMaterial />
      <rawShaderMaterial args={planeShaders} />
    </mesh>
  )
}

/**
 * Main Component
 */
function Shaders() {
  return (
    <div style={{ height: '100vh', backgroundColor: 'black' }}>
      <Canvas
        shadows
        camera={{
          fov: 45,
          position: [15, 10, 15],
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

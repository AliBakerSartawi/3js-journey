import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, extend, useFrame, useLoader } from '@react-three/fiber';
import { Physics, useBox, usePlane, useSphere } from '@react-three/cannon';
import { OrbitControls, shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { folder, Leva, useControls } from 'leva';

// shader imports using raw-loader package
/* eslint-disable import/no-webpack-loader-syntax */
import vertexShader from '!!raw-loader!./shaders/ragingSea/water/vertex.vs.glsl';
import fragmentShader from '!!raw-loader!./shaders/ragingSea/water/fragment.fs.glsl';

// import vertexShader from './shaders/ragingSea/water/vertex.vs.glsl';
// import fragmentShader from './shaders/ragingSea/water/fragment.fs.glsl';

// glsl import
// import glsl from 'babel-plugin-glsl/macro';

const WaterShaderMaterial = shaderMaterial(
  {
    uAlpha: 0,
    uTime: 0,
    // WAVES
    uBigWavesElevation: 0.2,
    // automatigically turned to vec2(4, 1.5)
    uBigWavesFrequency: [4, 1.5],
    uBigWavesSpeed: 0,
    // COLORS
    uDepthColor: new THREE.Color(0, 0, 0),
    uSurfaceColor: new THREE.Color(0, 0, 0)
  },
  `${vertexShader}`,
  `${fragmentShader}`
);

extend({ WaterShaderMaterial });

/**
 * Plane Component
 */
function Plane() {
  const plane = useRef();
  const shaderMaterial = useRef();

  const {
    doubleSide,
    wireframe,
    transparent,
    opacity,
    uBigWavesElevation,
    uBigWavesFrequency,
    uBigWavesSpeed,
    uDepthColor,
    uSurfaceColor
  } = useControls({
    ShaderFrequency: folder({
      wireframe: false,
      doubleSide: true,
      transparent: true,
      opacity: { value: 0.75, min: 0, max: 1.0, step: 0.01 },
      uBigWavesElevation: { value: 0.2, min: 0, max: 1.0, step: 0.001 },
      uBigWavesFrequency: {
        value: [4, 1.5],
        min: [0, 0],
        max: [10, 10],
        step: 0.01
      },
      uBigWavesSpeed: { value: 0.75, min: 0, max: 4, step: 0.01 },
      uDepthColor: '#0000ff',
      uSurfaceColor: '#8888ff'
    })
  });

  useFrame(({ clock }) => (shaderMaterial.current.uTime = clock.elapsedTime));

  return (
    <mesh ref={plane} transparent={transparent} rotation={[-Math.PI / 2, 0, 0]}>
      <planeBufferGeometry args={[2, 2, 128, 128]} />
      <waterShaderMaterial
        ref={shaderMaterial}
        wireframe={wireframe}
        transparent={transparent}
        side={doubleSide ? THREE.DoubleSide : null}
        // uniforms 👇
        uAlpha={opacity}
        // sending uTime like this will cause an error, just provide it in uniforms, as it is already a property on the ref
        // uTime={shaderMaterial.current.uTime}

        // WAVES
        uBigWavesElevation={uBigWavesElevation}
        uBigWavesFrequency={uBigWavesFrequency}
        uBigWavesSpeed={uBigWavesSpeed}
        // COLORS
        uDepthColor={uDepthColor}
        uSurfaceColor={uSurfaceColor}
      />
    </mesh>
  );
}

/**
 * Main Component
 */
function RagingSea() {
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
          position: [2, 2, 2],
          near: 0.1,
          far: 2000
        }}
      >
        <axesHelper args={[10]} />
        <OrbitControls />

        <Plane />

        <Lights />
      </Canvas>
      <Leva />
    </div>
  );
}

export default RagingSea;

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

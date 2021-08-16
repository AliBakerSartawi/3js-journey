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
    uBigWavesElevation: 0.2
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

  const { doubleSide, wireframe, transparent, opacity, uBigWavesElevation } =
    useControls({
      ShaderFrequency: folder({
        wireframe: false,
        doubleSide: true,
        transparent: true,
        opacity: { value: 0.75, min: 0, max: 1.0, step: 0.01 },
        uBigWavesElevation: { value: 0.2, min: 0, max: 1.0, step: 0.001 }
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
        // uTime is provided by altering the ref directly inside useFrame
        uAlpha={opacity}
        uBigWavesElevation={uBigWavesElevation}
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

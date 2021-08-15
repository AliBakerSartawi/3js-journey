import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, extend, useFrame, useLoader } from '@react-three/fiber';
import { Physics, useBox, usePlane, useSphere } from '@react-three/cannon';
import { OrbitControls, shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { folder, Leva, useControls } from 'leva';

// shader imports using raw-loader package
/* eslint-disable import/no-webpack-loader-syntax */
import vertexShader from '!!raw-loader!./shaders/shaderPatterns/vertex.vs.glsl';
import fragmentShader from '!!raw-loader!./shaders/shaderPatterns/fragment.fs.glsl';

// import vertexShader from './shaders/shaderPatterns/vertex.vs.glsl';
// import fragmentShader from './shaders/shaderPatterns/fragment.fs.glsl';

// glsl import
// import glsl from 'babel-plugin-glsl/macro';

function BufferAttributes() {
  const buffer = useRef();

  const [array, bufferCount, itemSize] = useMemo(() => {
    const bufferCount = 1089;
    const itemSize = 1;
    const array = new Float32Array(bufferCount);

    for (let i = 0; i < bufferCount; i++) {
      array[i] = Math.random();
    }
    return [array, bufferCount, itemSize];
  }, []);

  return (
    <bufferAttribute
      ref={buffer}
      attachObject={['attributes', 'aRandom']}
      count={bufferCount}
      array={array}
      itemSize={itemSize}
    />
  );
}

const PlaneShaderMaterial = shaderMaterial(
  {
    uTime: 0,
    uFrequency: new THREE.Vector2(10, 5),
    uColor: new THREE.Color(0, 0, 0),
    uAlpha: 0.5,
    uTexture: new THREE.Texture(),
    uNormals: false,
    uNormals2: false
  },
  `${vertexShader}`,
  `${fragmentShader}`
);

extend({ PlaneShaderMaterial });

/**
 * Plane Component
 */
function Plane() {
  const plane = useRef();
  const shaderMaterial = useRef();

  const {
    uFrequencyX,
    uFrequencyY,
    transparent,
    wireframe,
    color,
    opacity,
    normals,
    normals2
  } = useControls({
    ShaderFrequency: folder({
      uFrequencyX: { value: 10, min: 0, max: 100, step: 0.1 },
      uFrequencyY: { value: 5, min: 0, max: 100, step: 0.1 },
      color: '#4a0026',
      normals: false,
      normals2: false,
      wireframe: false,
      transparent: true,
      opacity: { value: 0.5, min: 0, max: 1.0, step: 0.01 }
    })
  });

  const [image] = useLoader(THREE.TextureLoader, [
    'https://images.unsplash.com/photo-1626553683558-dd8dc97e40a4?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1868&q=80'
  ]);

  useFrame(({ clock }) => (shaderMaterial.current.uTime = clock.elapsedTime));

  return (
    <mesh ref={plane} transparent={transparent} scale-y={2 / 3}>
      <planeBufferGeometry args={[1, 1, 32, 32]}>
        <BufferAttributes />
      </planeBufferGeometry>
      <planeShaderMaterial
        ref={shaderMaterial}
        wireframe={wireframe}
        transparent={transparent}
        side={THREE.DoubleSide}
        // uniforms 👇
        uFrequency={new THREE.Vector2(uFrequencyX, uFrequencyY)}
        // uTime is provided by altering the ref directly inside useFrame
        uColor={new THREE.Color(color)}
        uAlpha={opacity}
        uTexture={image}
        uNormals={normals}
        uNormals2={normals2}
      />
    </mesh>
  );
}

/**
 * Main Component
 */
function ShaderPatterns() {
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
      <Leva />
    </div>
  );
}

export default ShaderPatterns;

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

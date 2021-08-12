import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { Physics, useBox, usePlane, useSphere } from '@react-three/cannon';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useControls, Leva } from 'leva';
import DuckModel from '../generatedModels/Duck';

/**
 * GLTF Models ⬇️
 * https://github.com/KhronosGroup/glTF-Sample-Models/tree/master/2.0
 * 
 * GLTF Types ⬇️
 * GLTF 
 * GLTF-Binary 
 * GLTF-Draco 
 * GLTF-Embedded
 * 
 * Note: OS might hide GLTF file extensions, use code editor to verify 
 * 
 * GLTF Structure ⬇️
 * Duck.gltf => JSON containing cameras, lights, materials & object transformation
 * Duck0.bin => binary that usually contains geometries (vertices positions, UV coordinates, normal, colors, etc...)
 * DuckCM.png => textures
 * 
 * GLTF-Binary Structure ⬇️
 * One file only in binary / usually lighter / hard to alter its data
 * 
 * GLTF-Draco Structure ⬇️
 * Like GLTF, but buffer data is compressed using the Draco Algorithm
 * Much lighter
 * 
 * GLTF-Embedded Structure ⬇️
 * One file only in JSON / heaviest type with structure and buffer in JSON
 */

/**
 * Duck Component
 */
function Duck() {
  const { Duck_Scale: scale } = useControls({
    Duck_Scale: [1, 1, 1]
  })
  return <DuckModel scale={scale} />
}


/**
 * Main Component
 */
function ImportedModels() {
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

        {/* OBJECTS */}
        <Plane />

        {/* MODELS */}
        <Duck />

        <Lights />
      </Canvas>
      <Leva oneLineLabels />
    </div>
  );
}

export default ImportedModels;

/**
 * Plane
 */
 function Plane(props) {
  return (
    <mesh
      // ref={plane}
      receiveShadow
      rotation-x={-Math.PI / 2}
    >
      <planeBufferGeometry args={[25, 25]} />
      <meshStandardMaterial color={'grey'} />
    </mesh>
  );
}

function Lights() {
  return (
    <>
      <hemisphereLight args={[0xe1e1e1, 0xe1e1e1, 1]} />
      <pointLight
        castShadow
        args={[0xe1e1e1, 1, 20, 1]}
        position={[-5, 5, 5]}
      />
    </>
  );
}

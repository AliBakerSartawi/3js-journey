import React, { useRef, useState, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { Physics, useBox, usePlane, useSphere } from '@react-three/cannon';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useControls, Leva } from 'leva';
import DuckModel from '../generatedModels/Duck';
import FlightHelmetModel from '../generatedModels/FlightHelmet';
import FoxModel from '../generatedModels/Fox';

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
 * Draco is a compression algorithm developed by Google (open source)
 * Like GLTF, but buffer data is compressed using the Draco Algorithm
 * Much lighter
 * Site => https://google.github.io/draco/
 * GitHub => https://github.com/google/draco
 * Using Web Assembly, the Draco decoder can run in worker, increasing performance significantly
 * ❔ When to use => if models are more than a handful of megabytes
 *    for example: loading might be reduced from 2 seconds to half a second,
 *    but in that half a second, the computer might freeze, because decoding is expensive  
 *
 * GLTF-Embedded Structure ⬇️
 * One file only in JSON / heaviest type with structure and buffer in JSON
 */

/**
 * Duck Component
 */
function Duck() {
  const { Duck_Scale: scale, Duck_Position: position } = useControls({
    Duck_Scale: [1, 1, 1],
    Duck_Position: [0, 0, 0]
  });
  return <DuckModel scale={scale} position={position} />;
}

/**
 * FlightHelmet Component
 */
function FlightHelmet() {
  const { FlightHelmet_Scale: scale, FlightHelmet_Position: position } =
    useControls({
      FlightHelmet_Scale: [2.5, 2.5, 2.5],
      FlightHelmet_Position: [0, 0, 2]
    });
  return <FlightHelmetModel scale={scale} position={position} />;
}

/**
 * Fox Component
 */
function Fox() {
  const { Fox_Scale: scale, Fox_Position: position } =
    useControls({
      Fox_Scale: [1, 1, 1],
      Fox_Position: [0, 0, -3]
    });
  return <FoxModel scale={scale} position={position} />;
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

        {/* MODELS / no need for suspense here as it is provided higher in the tree */}
        <Duck />
        <FlightHelmet />
        <Fox />

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

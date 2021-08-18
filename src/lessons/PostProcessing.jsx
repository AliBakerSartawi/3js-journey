import React, { useRef, useState, useMemo, Suspense, useEffect } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { Physics, useBox, usePlane, useSphere } from '@react-three/cannon';
import { Environment, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useControls, Leva, folder } from 'leva';
import FlightHelmetModel from '../generatedModels/FlightHelmet';
import DamagedHelmetModel from '../generatedModels/DamagedHelmet';

// env imports
import px from '../textures/environmentMaps/3/px.jpg';
import nx from '../textures/environmentMaps/3/nx.jpg';
import py from '../textures/environmentMaps/3/py.jpg';
import ny from '../textures/environmentMaps/3/ny.jpg';
import pz from '../textures/environmentMaps/3/pz.jpg';
import nz from '../textures/environmentMaps/3/nz.jpg';

/**
 * FlightHelmet Component
 */
function DamagedHelmet({ environmentMapTexture }) {
  const {
    scale,
    position,
    rotationY,
    envMapIntensity,
    shadows,
  } = useControls({
    FlightHelmet: folder(
      {
        scale: [2.5, 2.5, 2.5],
        position: [0, 0, 0],
        rotationY: { value: 0, min: 0, max: Math.PI * 2, step: 0.1 },
        envMapIntensity: { value: 2, min: 0, max: 10, step: 0.1 },
        shadows: true,
      },
      {
        // collapsed: true
      }
    )
  });
  return (
    <DamagedHelmetModel
      scale={scale}
      position={position}
      rotation={[0, rotationY, 0]}
      envMap={environmentMapTexture}
      envMapIntensity={envMapIntensity}
      shadows={shadows}
    />
  );
}


/**
 * Main Component
 */
function PostProcessing() {
  // const { ACESFilmicToneMapping } = useControls({
  //   Canvas: folder({
  //     ACESFilmicToneMapping: true
  //   })
  // })

  const [environmentMapTexture] = useLoader(THREE.CubeTextureLoader, [
    [px, nx, py, ny, pz, nz]
  ]);
  // makes lighting and colors much more realistic
  environmentMapTexture.encoding = THREE.sRGBEncoding;
  // Note: do not apply sRGBEncoding on textures such as normals or roughness etc...

  return (
    <div style={{ height: '100vh', backgroundColor: 'black' }}>
      <Canvas
        shadows
        gl={{ physicallyCorrectLights: true }}
        camera={{
          fov: 45,
          position: [0, 2, 12],
          near: 0.1,
          far: 2000
        }}
        onCreated={(canvas) => {
          // console.log(canvas.gl);
          // gl === renderer in vanilla THREE
          // gl.outputEncoding is THREE.sRGBEncoding by default in @react-three/fiber
          // canvas.gl.physicallyCorrectLights = true;
          canvas.scene.background = environmentMapTexture;
        }}
      >
        
        <OrbitControls />

        {/* MODELS / no need for suspense here as it is provided higher in the tree */}
        <DamagedHelmet environmentMapTexture={environmentMapTexture} />

        <Lights />
      </Canvas>
      <Leva />
    </div>
  );
}

export default PostProcessing;

function Lights() {
  const {
    color,
    intensity,
    position,
    castShadow
  } = useControls({
    directionalLight: folder(
      {
        color: '#ffffff',
        intensity: { value: 3, min: 0, max: 10, step: 0.01 },
        position: [0.25, 3, 1],
        castShadow: true
      },
      {
        // collapsed: true
      }
    )
  });
  return (
    <>
      <directionalLight
        color={color}
        position={position}
        intensity={intensity}
        castShadow={castShadow}
        shadow-mapSize={[1024, 1024]}
        // tweak normalBias to remove shadow acne on the burger
        // start testing from 0.01 and go up
        // increasing the value too much will create wrong shadows
        // usually, 0.05 is more than enough
        shadow-normalBias={0.02}
        // if surface is flat (not rounded), try using bias instead of normalBias
      />
    </>
  );
}

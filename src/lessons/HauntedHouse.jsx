import React, { useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import * as dat from 'dat.gui';

function HauntedHouse() {
  const plane = useRef();
  const sphere = useRef();

  useEffect(() => {
    setTimeout(() => {
      guiInit();
      guiAdd(plane.current, sphere.current);
    }, 50);
  });
  return (
    <div style={{ height: '100vh', backgroundColor: 'rgb(26, 26, 26)' }}>
      <Canvas
        camera={{
          fov: 45,
          position: [3, 3, 3],
          near: 0.1,
          far: 2000
        }}
      >
        <axesHelper args={[10, 10]} />
        <OrbitControls />

        {/* PLANE */}
        <mesh receiveShadow ref={plane} rotation-x={-Math.PI / 2}>
          <planeBufferGeometry args={[10, 10]} />
          <meshStandardMaterial color={'seagreen'} />
        </mesh>

        {/* SPHERE */}
        <mesh castShadow ref={sphere} position={[0, 0.5, 0]}>
          <sphereBufferGeometry args={[0.5]} />
          <meshStandardMaterial />
        </mesh>

        <Lights />
      </Canvas>
    </div>
  );
}

export default HauntedHouse;

function Lights() {
  const ambient = useRef();
  const directional = useRef();

  useEffect(() => {
    setTimeout(() => {
      guiAddLights(ambient.current, directional.current);
    }, 50);
  }, []);
  return (
    <>
      <ambientLight ref={ambient} args={[0xffffff, 0.3]} />
      <directionalLight
        ref={directional}
        castShadow
        position={[2, 2, 2]}
        args={[0xffffff, 0.7]}
        lookAt={new THREE.Vector3()}
      />
    </>
  );
}

/**
 * Debug
 */
let gui;
function guiInit() {
  gui = new dat.GUI({ width: 400 });
}

function guiAdd(plane, sphere) {
  const parameters = {};
}

function guiAddLights(ambient, directional) {
  gui.add(ambient, 'intensity').min(0).max(1).name('Ambient Intensity');
  gui.add(directional, 'intensity').min(0).max(1).name('Directional Intensity');
}

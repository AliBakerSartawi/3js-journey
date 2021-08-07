import React, { useEffect, useRef } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

/**
 * Camera component
 */
function Motion({}) {
  // useFrame(({ camera, clock }, delta) => {
  // });
  return null;
}

/**
 * Lights component
 */
function Lights() {
  return (
    <>
      <ambientLight args={[0xffffff, 0.5]} />
      <pointLight castShadow args={[0xffffff, 0.5]} position={[2, 3, 4]} />
    </>
  );
}

/**
 * Main Component
 */
function Text() {
  return (
    <div style={{ height: '100vh', backgroundColor: 'rgb(26, 26, 26)' }}>
      <Canvas
        shadows
        pixelRatio={Math.min(window.devicePixelRatio, 2)}
        camera={{
          fov: 45,
          position: [3, 3, 3],
          near: 0.1,
          far: 2000
        }}
      >
        <axesHelper args={[10]} />
        <OrbitControls dampingFactor={0.05} />
        {/* <Motion /> */}
        {/* <Lights /> */}

      {/* MESHES */}
      <mesh>
        <boxBufferGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color={'whitesmoke'} />
      </mesh>

      </Canvas>
    </div>
  );
}

export default Text;

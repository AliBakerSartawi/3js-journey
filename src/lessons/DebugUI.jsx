import React, { useEffect, useMemo, useRef } from 'react';
import { Canvas, useThree, useFrame, extend } from '@react-three/fiber';
import { OrbitControls, TrackballControls } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import * as dat from 'dat.gui';

/**
 * Debug
 */
const gui = new dat.GUI();

/**
 * Geometries
 */
const positionsArray = new Float32Array([
  // first vertex
  0, 0, 0,
  // second vertex
  0, 1, 0,
  // third vertex
  1, 0, 0
]);
const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3);

const count = 500; // number of triangle we want
// count * 3 (number of vertices) * 3 (x, y, z)
const positionsArray2 = new Float32Array(count * 3 * 3);
for (let i = 0; i < positionsArray2.length; i++) {
  positionsArray2[i] = (Math.random() - 0.5) * 2;
}
const positionsAttribute2 = new THREE.BufferAttribute(positionsArray2, 3);

/**
 * Debug Component
 */
function guiAdd(box) {
  // console.log(box)
  gui.add(
    // object name
    box.current.position,
    // concerned property as a string
    'x',
    // min
    -3,
    // max
    3,
    // step (precision)
    0.01
  );
  gui.add(box.current.position, 'y', -3, 3, 0.01);
  // or a cleaner way ⬇️
  gui.add(box.current.position, 'z').min(-3).max(3).step(0.01).name('boxPositionZ');

  gui.add(box.current, 'visible')
    .name('boxVisibility')
}

/**
 * Main Component
 */
function DebugUI() {
  const box = useRef();

  useEffect(() => {
    setTimeout(() => {
      guiAdd(box);
    }, 1000);
  }, []);

  return (
    <div style={{ height: '100vh', backgroundColor: 'rgb(26, 26, 26)' }}>
      <Canvas
        pixelRatio={Math.min(window.devicePixelRatio, 2)}
        camera={{
          fov: 45,
          position: [1, 1, 8],
          near: 0.1,
          far: 2000
        }}>
        <axesHelper args={[10]} />
        <OrbitControls dampingFactor={0.05} />

        <mesh
          ref={box}
          rotation={[Math.PI * 0.25, Math.PI * 0.25, 0, 'YXZ']}
          position={[2, 1, 1]}
          scale={[0.5, 0.5, 0.5]}>
          <axesHelper args={[3]} />
          <boxBufferGeometry args={[1, 2, 3, 2, 2, 2]} />
          <meshBasicMaterial wireframe color="crimson" />
        </mesh>

        <mesh position={[0, 1, 0]}>
          {/* easy way to create a triangle, provide 1 to the second arg */}
          <circleBufferGeometry args={[1, 1]} />
          <meshBasicMaterial wireframe color="hotpink" />
        </mesh>

        <mesh position={[0, 1, 1.25]}>
          <bufferGeometry attributes={{ position: positionsAttribute }} />
          <meshBasicMaterial wireframe color="aqua" />
        </mesh>

        <mesh position={[0, 1, 2.5]}>
          <bufferGeometry attributes={{ position: positionsAttribute2 }} />
          <meshBasicMaterial wireframe color="goldenrod" />
        </mesh>
      </Canvas>
    </div>
  );
}

export default DebugUI;

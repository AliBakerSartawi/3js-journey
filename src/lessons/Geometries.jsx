import React, { useEffect, useRef } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, TrackballControls } from '@react-three/drei';
import gsap from 'gsap';

// import * as THREE from 'three';
// const lookAtRef = new THREE.Vector3();

// the camera must be used in a component inside the Canvas component
function Camera({ box, group }) {

  return null;
}

function Geometries() {
  const box = useRef();
  const group = useRef();

  return (
    <div style={{ height: '100vh', backgroundColor: 'rgb(26, 26, 26)' }}>
      <Canvas
        pixelRatio={Math.min(window.devicePixelRatio, 2)}
        camera={{
          fov: 45,
          position: [1, 1, 5],
          near: 0.1,
          far: 2000
        }}
      >
        <axesHelper args={[10]} />
        <OrbitControls
          dampingFactor={0.05}
        />
        <Camera box={box} group={group} />
        <group
          // changes properties of what's inside the group combined
          ref={group}
          position={[1, 1, 1]}
          scale={[0.7, 0.7, 0.7]}
          rotation={[0, 0, 0]}>
          <axesHelper args={[5]} />
          <mesh
            ref={box}
            rotation={[Math.PI * 0.25, Math.PI * 0.25, 0, 'YXZ']}
            position={[1, 1, 1]}
            scale={[0.5, 0.5, 0.5]}>
            <axesHelper args={[3]} />
            <boxGeometry
              args={[1, 1, 1]}
            />
            <meshBasicMaterial color="crimson" />
          </mesh>
          <mesh position={[0, 2, 2]} scale={[0.5, 0.5, 0.5]}>
            <axesHelper args={[3]} />
            <sphereGeometry />
            <meshBasicMaterial color="lime" />
          </mesh>
        </group>
      </Canvas>
    </div>
  );
}

export default Geometries;

import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

function HauntedHouse() {
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
        <mesh rotation-x={-Math.PI / 2}>
          <planeBufferGeometry args={[10, 10]}  />
          <meshBasicMaterial color={'seagreen'} />
        </mesh>

        {/* SPHERE */}
        <mesh position={[0, 1, 0]}>
          <sphereBufferGeometry args={[1]} />
          <meshBasicMaterial />
        </mesh>
      </Canvas>
    </div>
  );
}

export default HauntedHouse;

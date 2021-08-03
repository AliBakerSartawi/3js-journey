import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

function BasicScene() {
  return (
    // default camera fov is 75 approximately
    <Canvas camera={{fov: 75, position: [3, 1, 3]}}>
      <OrbitControls />
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        {/* better way to declare colors is like this "0xff0000" */}
        <meshBasicMaterial color="crimson" />
      </mesh>
    </Canvas>
  );
}

export default BasicScene;

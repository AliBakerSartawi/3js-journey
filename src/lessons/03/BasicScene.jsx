import React from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

function BasicScene() {
  return (
    <Canvas>
      <OrbitControls enablePan={false} />
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="crimson" />
      </mesh>
    </Canvas>
  )
}

export default BasicScene

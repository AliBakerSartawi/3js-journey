/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import React, { useRef } from 'react'
import { useGLTF, PerspectiveCamera } from '@react-three/drei'

export default function Model(props) {
  const group = useRef()
  // fix path to public folder
  const { nodes, materials } = useGLTF('./duck/Duck.gltf')
  return (
    <group ref={group} {...props} dispose={null}>
      <group scale={0.01}>
        <PerspectiveCamera
          makeDefault={false}
          far={10000}
          near={1}
          fov={37.85}
          position={[400.11, 463.26, -431.08]}
          rotation={[-2.31, 0.57, 2.61]}
        />
        <mesh geometry={nodes.LOD3spShape.geometry} material={materials['blinn3-fx']} />
      </group>
    </group>
  )
}

// fix path to public folder
useGLTF.preload('./duck/Duck.gltf')

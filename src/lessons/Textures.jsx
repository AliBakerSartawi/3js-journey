import React, { useEffect, useMemo, useRef, Suspense } from 'react';
import { Canvas, useThree, useFrame, extend, useLoader } from '@react-three/fiber';
import { OrbitControls, TrackballControls } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

/**
 * useful links
 * https://3dtextures.me/
 * https://3dtextures.me/2019/04/16/door-wood-001/
 * https://marmoset.co/posts/physically-based-rendering-and-you-can-too/
 * https://marmoset.co/posts/basic-theory-of-physically-based-rendering/
 */

/**
 * texture imports
 */
import doorImg from '../textures/door/basecolor.jpg'

/**
 * loaders
 */
// const texture = new THREE.Texture(doorImg)
// console.log(texture)

/**
 * Main Component
 */
function Textures() {
  const box = useRef();
  const [texture] = useLoader(THREE.TextureLoader, [doorImg])
  console.log(texture)

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
            {texture && <meshBasicMaterial attach="material" map={texture} />}
          </mesh>
          <mesh position={[0, 1, 0]}>
            {/* easy way to create a triangle, provide 1 to the second arg */}
            <circleBufferGeometry args={[1, 1]} />
            <meshBasicMaterial wireframe color="hotpink" />
          </mesh>

      </Canvas>
    </div>
  );
}

export default Textures;
import React, { useEffect, useMemo, useRef, Suspense } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, TrackballControls, Loader } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

/**
 * texture imports
 */
import doorColor from '../textures/door/basecolor.jpg';
import doorAmbientOcclusion from '../textures/door/ambientOcclusion.jpg';
import doorHeight from '../textures/door/height.png';
import doorMetallic from '../textures/door/metallic.jpg';
import doorNormal from '../textures/door/normal.jpg';
import doorOpacity from '../textures/door/opacity.jpg'; // opacity is also called alpha
import doorRoughness from '../textures/door/roughness.jpg';
import gradient3 from '../textures/gradients/3.jpg'
import matcap1 from '../textures/matcaps/1.png'

/**
 * material
 *
 * if multiple meshes have the same material, it is better for performance
 * to make one material, and provide it as props for the mesh element
 * instead of writing a child material tag for each mesh, but changing the sub props
 * such as (material-wireframe) on one mesh will affect all the other meshes
 */
const material = new THREE.MeshBasicMaterial({ color: 'crimson' });

/**
 * Camera component
 */
function Motion({ plane, sphere, torus }) {
  useFrame(({ camera, clock }, delta) => {
    console.log(clock.elapsedTime);

    plane.current.rotation.z = 0.1 * clock.elapsedTime;

    sphere.current.rotation.y = 0.1 * clock.elapsedTime;

    torus.current.rotation.x = 0.1 * clock.elapsedTime;
  });
  return null;
}

/**
 * Main Component
 */
function Materials() {
  const plane = useRef();
  const sphere = useRef();
  const torus = useRef();

  /**
   * loading textures
   */
  const [
    doorColorTexture,
    doorAmbientOcclusionTexture,
    doorHeightTexture,
    doorMetallicTexture,
    doorNormalTexture,
    doorOpacityTexture,
    doorRoughnessTexture
  ] = useLoader(THREE.TextureLoader, [
    doorColor,
    doorAmbientOcclusion,
    doorHeight,
    doorMetallic,
    doorNormal,
    doorOpacity,
    doorRoughness
  ]);

  return (
    <div style={{ height: '100vh', backgroundColor: 'rgb(26, 26, 26)' }}>
      <Canvas
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
        <Motion plane={plane} sphere={sphere} torus={torus} />

        {/* plane */}
        <mesh ref={plane} rotation={[-Math.PI / 2, 0, 0]}>
          <planeBufferGeometry args={[10, 10, 10, 10]} />
          <meshBasicMaterial wireframe color="crimson" />
        </mesh>

        {/* sphere */}
        <mesh
          ref={sphere}
          // rotation={[Math.PI * 0.25, Math.PI * 0.25, 0, 'YXZ']}
          position={[2, 1, 1]}
          // scale={[0.5, 0.5, 0.5]}
        >
          <axesHelper args={[3]} />
          <sphereBufferGeometry args={[0.5, 16, 16]} />
          <meshBasicMaterial wireframe />
        </mesh>

        {/* torus */}
        <mesh ref={torus} position={[0, 1, 0]}>
          <torusBufferGeometry args={[0.3, 0.2, 16, 32]} />
          <meshBasicMaterial wireframe color="hotpink" />
        </mesh>
      </Canvas>
    </div>
  );
}

export default Materials;

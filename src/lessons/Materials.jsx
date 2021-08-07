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
import gradient3 from '../textures/gradients/3.jpg';
import matcap1 from '../textures/matcaps/1.png';
import matcap3 from '../textures/matcaps/3.png';
import matcap7 from '../textures/matcaps/7.png';
import matcap8 from '../textures/matcaps/8.png';

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
 * meshNormalMaterial website
 * https://www.ilithya.rocks/
 */

/**
 * MATCAPS
 * https://github.com/nidorx/matcaps
 */

/**
 * Camera component
 */
function Motion({ plane, sphere, torus, torus2 }) {
  useFrame(({ camera, clock }, delta) => {
    console.log(clock.elapsedTime);

    plane.current.rotation.z = 0.1 * clock.elapsedTime;

    sphere.current.rotation.y = 0.1 * clock.elapsedTime;

    torus.current.rotation.x = 0.1 * clock.elapsedTime;
    torus2.current.rotation.x = 0.1 * clock.elapsedTime;
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
  const torus2 = useRef();

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
    doorRoughnessTexture,
    gradient3Texture,
    matcap1Texture,
    matcap3Texture,
    matcap7Texture,
    matcap8Texture,
  ] = useLoader(THREE.TextureLoader, [
    doorColor,
    doorAmbientOcclusion,
    doorHeight,
    doorMetallic,
    doorNormal,
    doorOpacity,
    doorRoughness,
    gradient3,
    matcap1,
    matcap3,
    matcap7,
    matcap8,
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
        <Motion plane={plane} sphere={sphere} torus={torus} torus2={torus2}/>

        {/* plane */}
        <mesh ref={plane} rotation={[-Math.PI / 2, 0, 0]}>
          <planeBufferGeometry args={[10, 10, 10, 10]} />
          <meshBasicMaterial
            map={doorColorTexture}
            transparent
            alphaMap={doorOpacityTexture}
            // DoubleSide requires more GPU calculations, use sparingly
            side={THREE.DoubleSide}
            // color adds tint above the texture
            color={'#00fe43'}
          />
        </mesh>

        {/* sphere */}
        <mesh
          ref={sphere}
          position={[2, 1, 1]}
        >
          <axesHelper args={[3]} />
          <sphereBufferGeometry args={[0.5, 16, 16]} />
          <meshNormalMaterial
            // flatshading can be cool for certain art types
            flatShading
            normalMap={doorNormalTexture}
          />
        </mesh>
        
        <mesh
          position={[0, 1, 1]}
        >
          <axesHelper args={[3]} />
          <sphereBufferGeometry args={[0.5, 16, 16]} />
          <meshMatcapMaterial
          matcap={matcap8Texture}
          />
        </mesh>

        {/* torus */}
        <mesh  position={[0, 1, 0]}>
          <torusBufferGeometry args={[0.3, 0.2, 16, 32]} />
          <meshBasicMaterial
            // transparent must be set to true, then provide opacity value
            transparent
            opacity={0.25}
            wireframe
            color={0xffffff}
          />
        </mesh>
        <mesh ref={torus} position={[0, 1, -1]}>
          <torusBufferGeometry args={[0.3, 0.2, 16, 32]} />
          {/* matcaps can simulate lights and shadow without having them in the scene */}
          <meshMatcapMaterial
          matcap={matcap3Texture}
          />
        </mesh>
        <mesh ref={torus2} position={[0, 1, -2]}>
          <torusBufferGeometry args={[0.3, 0.2, 16, 32]} />
          {/* matcaps can simulate lights and shadow without having them in the scene */}
          <meshMatcapMaterial
          matcap={matcap7Texture}
          />
        </mesh>
      </Canvas>
    </div>
  );
}

export default Materials;

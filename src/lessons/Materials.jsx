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
function Motion({ plane, sphere, torus, torus2, torus3, torus4, torus5 }) {
  useFrame(({ camera, clock }, delta) => {
    console.log(clock.elapsedTime);

    plane.current.rotation.z = 0.1 * clock.elapsedTime;

    sphere.current.rotation.y = 0.1 * clock.elapsedTime;

    torus.current.rotation.x = 0.1 * clock.elapsedTime;
    torus2.current.rotation.x = 0.1 * clock.elapsedTime;
    torus3.current.rotation.x = 0.1 * clock.elapsedTime;
    torus4.current.rotation.x = 0.1 * clock.elapsedTime;
    torus5.current.rotation.x = 0.1 * clock.elapsedTime;
  });
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
function Materials() {
  const plane = useRef();
  const sphere = useRef();
  const torus = useRef();
  const torus2 = useRef();
  const torus3 = useRef();
  const torus4 = useRef();
  const torus5 = useRef();

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
    matcap8Texture
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
    matcap8
  ]);

  // gradient3Texture.minFilter = THREE.NearestFilter
  // because gradient picture is small, we should alter the magFilter
  gradient3Texture.magFilter = THREE.NearestFilter;
  // disabling mipmaps increases performance,
  // ... we don't need them since the minFilter and/or magFilter = NearestFilter
  gradient3Texture.generateMipmaps = false;

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
        <Motion
          plane={plane}
          sphere={sphere}
          torus={torus}
          torus2={torus2}
          torus3={torus3}
          torus4={torus4}
          torus5={torus5}
        />
        <Lights />

        {/* plane */}
        <mesh
          ref={plane}
          receiveShadow
          position={[0, 0.49, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeBufferGeometry args={[10, 10, 10, 10]} />
          {/* meshBasicMaterial cannot receive shadows, but Standard does */}
          <meshStandardMaterial
            map={doorColorTexture}
            // DoubleSide requires more GPU calculations, use sparingly
            side={THREE.DoubleSide}
            // color adds tint above the texture
            // color={'#00fe43'}
            
            // unlike lambert and phong, standard supports roughness and metalness
            metalness={1}
            metalnessMap={doorMetallicTexture}
            roughness
            roughnessMap={doorRoughnessTexture}
            
            // other maps
            normalMap={doorNormalTexture}
            transparent
            alphaMap={doorOpacityTexture}
            
            
          />
        </mesh>

        {/* sphere */}
        <mesh ref={sphere} position={[2.5, 1, 1]}>
          <axesHelper args={[3]} />
          <sphereBufferGeometry args={[0.5, 16, 16]} />
          <meshNormalMaterial
            // flatshading can be cool for certain art types
            flatShading
            normalMap={doorNormalTexture}
          />
        </mesh>

        <mesh position={[1.25, 1, 1]}>
          <axesHelper args={[3]} />
          <sphereBufferGeometry args={[0.5, 16, 16]} />
          <meshMatcapMaterial matcap={matcap8Texture} />
        </mesh>

        {/* torus */}
        <mesh position={[0, 1, 0]}>
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
          <meshMatcapMaterial matcap={matcap3Texture} />
        </mesh>
        <mesh position={[0, 1, -2]}>
          <torusBufferGeometry args={[0.3, 0.2, 16, 32]} />
          {/* matcaps can simulate lights and shadow without having them in the scene */}
          <meshMatcapMaterial matcap={matcap7Texture} />
        </mesh>

        {/* materials that react to light */}
        {/* lambert */}
        <mesh castShadow ref={torus2} position={[0, 1, 1]}>
          <torusBufferGeometry args={[0.3, 0.2, 16, 32]} />
          <meshLambertMaterial />
        </mesh>

        {/* phong */}
        <mesh castShadow ref={torus3} position={[0, 1, 2]}>
          <torusBufferGeometry args={[0.3, 0.2, 16, 32]} />
          {/* phong is smoother than lambert, but lambert is more performant */}
          <meshPhongMaterial
            color={0x1f1f1f}
            shininess={100}
            // specular => color of reflection
            specular={0xff2233}
          />
        </mesh>

        {/* toon */}
        <mesh castShadow ref={torus4} position={[0, 1, 3]}>
          <torusBufferGeometry args={[0.3, 0.2, 16, 32]} />
          {/* phong is smoother than lambert, but lambert is more performant */}
          <meshToonMaterial
            color={0x237648}
            // gradientMap can make it smoother, unless min & mag filters are fixed on the texture
            gradientMap={gradient3Texture}
          />
        </mesh>

        {/* standard => arguably the best one */}
        <mesh castShadow ref={torus5} position={[0, 1, 4]}>
          <torusBufferGeometry args={[0.3, 0.2, 16, 32]} />
          {/* phong is smoother than lambert, but lambert is more performant */}
          <meshStandardMaterial color={0x237648} />
        </mesh>
      </Canvas>
    </div>
  );
}

export default Materials;

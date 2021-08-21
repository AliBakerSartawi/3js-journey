import React, {
  useEffect,
  useMemo,
  useRef,
  Suspense,
  useLayoutEffect
} from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, TrackballControls, Loader } from '@react-three/drei';
import * as THREE from 'three';
import { Leva, useControls, folder } from 'leva';
import gsap from 'gsap';

/**
 * texture imports
 */
import doorColor from '../textures/door/basecolor.jpg';
import doorAmbientOcclusion from '../textures/door/ambientOcclusion.jpg';
import doorHeight from '../textures/door/height.png';
import doorMetallic from '../textures/door/metallic.jpg';
import doorNormal from '../textures/door/normal.jpg'; // https://www.ilithya.rocks/
import doorOpacity from '../textures/door/opacity.jpg'; // opacity is also called alpha
import doorRoughness from '../textures/door/roughness.jpg';
import gradient3 from '../textures/gradients/3.jpg';
/**
 * MATCAPS
 * https://github.com/nidorx/matcaps
 */
import matcap1 from '../textures/matcaps/1.png';
import matcap3 from '../textures/matcaps/3.png';
import matcap7 from '../textures/matcaps/7.png';
import matcap8 from '../textures/matcaps/8.png';

/**
 * environment texture imports
 * p => positive
 * n => negative
 * https://polyhaven.com/hdris
 *
 * convert hdri to cube map => https://matheowis.github.io/HDRI-to-CubeMap/
 */
import px from '../textures/environmentMaps/0/px.jpg';
import nx from '../textures/environmentMaps/0/nx.jpg';
import py from '../textures/environmentMaps/0/py.jpg';
import ny from '../textures/environmentMaps/0/ny.jpg';
import pz from '../textures/environmentMaps/0/pz.jpg';
import nz from '../textures/environmentMaps/0/nz.jpg';

console.log(px, nx, py, ny, pz, nz);

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
function Motion({ plane, sphere, torus, torus2, torus3, torus4, torus5 }) {
  useFrame(({ camera, clock }, delta) => {
    // sphere.current.rotation.y = 0.1 * clock.elapsedTime;
    // torus.current.rotation.x = 0.1 * clock.elapsedTime;
    // torus2.current.rotation.x = 0.1 * clock.elapsedTime;
    // torus3.current.rotation.x = 0.1 * clock.elapsedTime;
    // torus4.current.rotation.x = 0.1 * clock.elapsedTime;
    // torus5.current.rotation.x = 0.1 * clock.elapsedTime;

    // sphere.current.rotation.x = sphere.current.rotation.y += 0.01;
    torus.current.rotation.x = torus.current.rotation.y += 0.01;
    torus2.current.rotation.x = torus2.current.rotation.y -= 0.01;
    torus3.current.rotation.x = torus3.current.rotation.y += 0.01;
    torus4.current.rotation.x = torus4.current.rotation.y -= 0.01;
    torus5.current.rotation.x = torus5.current.rotation.y += 0.01;
  });
  return null;
}

/**
 * ApplyAOMap Component
 */
function ApplyAOMap({ plane }) {
  useEffect(() => {
    plane.current &&
      plane.current.geometry.setAttribute(
        'uv2',
        new THREE.BufferAttribute(plane.current.geometry.attributes.uv.array, 2)
      );
    console.log('aoMap');
  }, [plane]);

  return null;
}

/**
 * Normals Component
 */
function Normals() {
  const ref = useRef();

  const {
    radialSegments,
    tubularSegments,
    radius,
    position,
    wireframe,
    castShadow,
    rotate
  } = useControls({
    Normals: folder({
      radialSegments: { value: 16, min: 2, max: 128, step: 1 },
      tubularSegments: { value: 32, min: 2, max: 128, step: 1 },
      radius: { value: 0.3, min: 0.1, max: 5, step: 0.01 },
      position: [1.5, 1, 1],
      wireframe: false,
      castShadow: true,
      rotate: true
    })
  });

  useFrame(() => {
    if (rotate) {
      ref.current.rotation.x = ref.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh castShadow={castShadow} ref={ref} position={position}>
      <torusBufferGeometry
        args={[radius, 0.2, radialSegments, tubularSegments]}
      />
      <meshNormalMaterial flatShading={true} wireframe={wireframe} />
    </mesh>
  );
}

/**
 * Plane Component
 */
function Plane() {
  return (
    <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
      <planeBufferGeometry args={[50, 50]} />
      <meshStandardMaterial side={THREE.DoubleSide} color={'orangered'} />
    </mesh>
  );
}

/**
 * Main Component
 */
function Materials() {
  /**
   * refs
   */
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

  /**
   * loading environment cubic texture
   */
  const [environmentMapTexture] = useLoader(THREE.CubeTextureLoader, [
    [px, nx, py, ny, pz, nz]
  ]);

  console.log(environmentMapTexture);

  // gradient3Texture.minFilter = THREE.NearestFilter
  // because gradient picture is small, we should alter the magFilter
  gradient3Texture.magFilter = THREE.NearestFilter;

  return (
    <div style={{ height: '100vh', backgroundColor: '#C01805' }}>
      <Canvas
        shadows
        pixelRatio={Math.min(window.devicePixelRatio, 2)}
        camera={{
          fov: 45,
          position: [5, 5, 5],
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

        {/* plane */}
        <Plane />

        {/* sphere */}
        <Normals />

        {/* torus */}
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
          <meshLambertMaterial envMap={environmentMapTexture} />
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

        {/* standard => arguably the best one => uses most realistic algorithms */}
        <mesh castShadow ref={torus5} position={[0, 1, 4]}>
          <torusBufferGeometry args={[0.3, 0.2, 16, 32]} />
          <meshStandardMaterial
            metalness={0}
            roughness={0}
            envMap={environmentMapTexture}
            color={0x000000}
          />
        </mesh>

        <Lights />
      </Canvas>
    </div>
  );
}

export default Materials;

/**
 * Lights component
 */
function Lights() {
  return (
    <>
      <hemisphereLight args={[0xe1e1e1, 0xe1e1e1, 0.5]} />
      <pointLight
        shadow-mapSize={[1024, 1024]}
        castShadow
        args={[0xe1e1e1, 1, 20, 1]}
        position={[2, 3, 4]}
      />
    </>
  );
}

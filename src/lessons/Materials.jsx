import React, {
  useEffect,
  useMemo,
  useRef,
  Suspense,
  useLayoutEffect,
  useState
} from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import {
  OrbitControls,
  TrackballControls,
  Loader,
  Html
} from '@react-three/drei';
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
import matcap2 from '../textures/matcaps/2.png';
import matcap3 from '../textures/matcaps/3.png';
import matcap4 from '../textures/matcaps/4.png';
import matcap5 from '../textures/matcaps/5.png';
import matcap6 from '../textures/matcaps/6.png';
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
 * Matcaps Component
 */
function Matcaps() {
  const ref = useRef();
  const [hidden, setHidden] = useState();

  // textures
  const [
    matcap1Texture,
    matcap2Texture,
    matcap3Texture,
    matcap4Texture,
    matcap5Texture,
    matcap6Texture,
    matcap7Texture,
    matcap8Texture
  ] = useLoader(THREE.TextureLoader, [
    matcap1,
    matcap2,
    matcap3,
    matcap4,
    matcap5,
    matcap6,
    matcap7,
    matcap8
  ]);

  const {
    matcap,
    radialSegments,
    tubularSegments,
    radius,
    tube,
    position,
    wireframe,
    castShadow,
    rotate,
    html
  } = useControls({
    Matcaps: folder(
      {
        matcap: { value: 5, options: [1, 2, 3, 4, 5, 6, 7, 8] },
        radialSegments: { value: 16, min: 2, max: 128, step: 1 },
        tubularSegments: { value: 32, min: 2, max: 128, step: 1 },
        radius: { value: 0.3, min: 0.1, max: 5, step: 0.01 },
        tube: { value: 0.2, min: 0.1, max: 5, step: 0.01 },
        position: [0, 1, -1],
        wireframe: false,
        castShadow: true,
        rotate: true,
        html: true
      },
      {
        collapsed: true
      }
    )
  });

  useFrame(() => {
    if (rotate) {
      ref.current.rotation.x = ref.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh castShadow={castShadow} ref={ref} position={position}>
      <torusBufferGeometry
        args={[radius, tube, radialSegments, tubularSegments]}
      />
      <meshMatcapMaterial
        wireframe={wireframe}
        matcap={
          matcap === 1
            ? matcap1Texture
            : matcap === 2
            ? matcap2Texture
            : matcap === 3
            ? matcap3Texture
            : matcap === 4
            ? matcap4Texture
            : matcap === 5
            ? matcap5Texture
            : matcap === 6
            ? matcap6Texture
            : matcap === 7
            ? matcap7Texture
            : matcap8Texture
        }
      />
      {html && (
        <Html
          distanceFactor={3.5}
          position={[0, 0.75, 0]}
          center
          className="donutMaterials"
          occlude
          onOcclude={setHidden}
          style={{
            transition: 'all 0.5s',
            opacity: hidden ? 0 : 1,
            transform: `scale(${hidden ? 0.5 : 1})`
          }}
        >
          <p>matcaps</p>
          <p>meshMatcapMaterial</p>
        </Html>
      )}
    </mesh>
  );
}

/**
 * Normals Component
 */
function Normals() {
  const ref = useRef();
  const [hidden, setHidden] = useState();

  const {
    radialSegments,
    tubularSegments,
    radius,
    tube,
    position,
    wireframe,
    castShadow,
    rotate,
    html
  } = useControls({
    Normals: folder(
      {
        radialSegments: { value: 16, min: 2, max: 128, step: 1 },
        tubularSegments: { value: 32, min: 2, max: 128, step: 1 },
        radius: { value: 0.3, min: 0.1, max: 5, step: 0.001 },
        tube: { value: 0.2, min: 0.1, max: 5, step: 0.001 },
        position: [1.5, 1, 1],
        wireframe: false,
        castShadow: true,
        rotate: true,
        html: true
      },
      {
        collapsed: true
      }
    )
  });

  useFrame(() => {
    if (rotate) {
      ref.current.rotation.x = ref.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh castShadow={castShadow} ref={ref} position={position}>
      <torusBufferGeometry
        args={[radius, tube, radialSegments, tubularSegments]}
      />
      <meshNormalMaterial flatShading={true} wireframe={wireframe} />
      {html && (
        <Html
          distanceFactor={3.5}
          position={[0, 0.75, 0]}
          center
          className="donutMaterials"
          occlude
          onOcclude={setHidden}
          style={{
            transition: 'all 0.5s',
            opacity: hidden ? 0 : 1,
            transform: `scale(${hidden ? 0.5 : 1})`
          }}
        >
          <p>Normals</p>
          <p>meshNormalMaterial</p>
        </Html>
      )}
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
   * loading environment cubic texture
   */
  const [environmentMapTexture] = useLoader(THREE.CubeTextureLoader, [
    [px, nx, py, ny, pz, nz]
  ]);

  console.log(environmentMapTexture);

  const { autoRotate } = useControls({
    OrbitControls: folder({
      autoRotate: false
    })
  });

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
        <OrbitControls dampingFactor={0.05} autoRotate={autoRotate} />
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

        {/* Donuts */}
        <Normals />

        <Matcaps />

        {/* materials that react to light */}
        {/* lambert */}
        <mesh castShadow ref={torus2} position={[0, 1, 1]}>
          <torusBufferGeometry args={[0.3, 0.2, 16, 32]} />
          <meshLambertMaterial
            envMap={environmentMapTexture}
            envMapIntensity={1}
          />
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
          <meshToonMaterial
            color={0x237648}
            // gradientMap can make it smoother, unless min & mag filters are fixed on the texture
            // gradientMap={gradient3Texture}
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

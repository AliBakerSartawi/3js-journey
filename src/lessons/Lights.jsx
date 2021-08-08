import React, { useEffect, useRef } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, useHelper } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { softShadows } from '@react-three/drei';

/**
 * MATCAPS
 */
import matcap1 from '../textures/matcaps/1.png';
import matcap3 from '../textures/matcaps/3.png';
import matcap7 from '../textures/matcaps/7.png';
import matcap8 from '../textures/matcaps/8.png';
import gradient3 from '../textures/gradients/3.jpg';
import gradient5 from '../textures/gradients/5.jpg';

// font import
import typefaceFont from '../fonts/helvetiker_regular.typeface.json';

const font = new THREE.FontLoader().parse(typefaceFont);
const textString = `';hello!?<>/*&%$#@!'`;
const textString2 = `!matcaps are dope!`;
const textOptions = {
  font,
  size: 1,
  height: 0.25,
  curveSegments: 8
};

// // softShadows
// softShadows()

/**
 * Camera component
 */
function Motion({ textMesh, textMesh2 }) {
  // if not inside a useEffect, will give ref undefined error
  useEffect(() => {
    // easy centering solution instead of computing bounding box and manually translating to -50%'s
    textMesh.current.geometry.center();
    textMesh2.current.geometry.center();
  }, [textMesh, textMesh2]);
  // useFrame(({clock: {elapsedTime}}) => {
  //   textMesh.current.rotation.x = elapsedTime * 0.1
  //   textMesh.current.rotation.y = elapsedTime * 0.1
  //   textMesh.current.rotation.z = elapsedTime * 0.1
  //   textMesh.current.geometry.center()
  // })
  return null;
}

/**
 * Lights component
 */
function Lighting() {
  return (
    <>
      {/* AMBIENT => applies light on every direction, hence, not shadow-related. It simulates light bouncing */}
      <ambientLight args={[0xffffff, 0.5]} />

      {/* DIRECTIONAL => faces the center of the scene (light starts from infinity to center) */}
      <directionalLight
        // castShadow
        position={[2, 3, 4]}
        args={[0xffffff, 0.3]}
      />

      {/* HEMISPHERE => like ambient, but with a color from the sky different from the one from the ground */}
      {/* if the scene has sky and grass, top blue and bottom green colors can give a nice effect */}
      <hemisphereLight args={['crimson', 'orangered', 1]} />

      {/* POINTLIGHT => illuminates in every direction starting from its position */}
      <pointLight
        castShadow
        position={[2, 3, 4]}
        args={[
          //color
          0xff9000,
          // intensity
          0.9,
          // distance
          20,
          // decay => how fast the light dims
          1
        ]}
      />

      {/* RECTAREALIGHT => mix between directional and diffuse light */}
      {/* light color is mixed with objects, if plane is orange and light is cyan, result would be yellowish */}
      {/* can have nice neon effect if rest of scene is dark */}
      <rectAreaLight rotation-x={-Math.PI /2} position={[0, 2.5, 0]} args={[0x4effee, 2, 5, 5]} />
    </>
  );
}

/**
 * Main Component
 */
function Lights() {
  const textMesh = useRef();
  const textMesh2 = useRef();

  const [matcap7Texture] = useLoader(THREE.TextureLoader, [matcap7]);

  const matcapMaterial = new THREE.MeshMatcapMaterial({
    matcap: matcap7Texture
  });
  const donut = new THREE.TorusBufferGeometry(0.3, 0.2, 20, 45);
  const arr = new Array(200).fill(0);

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
        <Motion textMesh={textMesh} textMesh2={textMesh2} />
        <Lighting />

        {/* TEXT MESHES */}
        <mesh castShadow ref={textMesh} position={[0, 0.5, -1]}>
          <textBufferGeometry args={[textString, textOptions]} />
          <meshStandardMaterial color={'crimson'} />
        </mesh>

        <mesh castShadow ref={textMesh2} position={[0, 0.5, 1]}>
          <textBufferGeometry args={[textString2, textOptions]} />
          <meshStandardMaterial color={'lime'} />
        </mesh>

        {/* DONUTS */}
        {arr.map((e, i) => {
          const scale = Math.random();
          return (
            <mesh
              position={[
                (Math.random() - 0.5) * 25,
                (Math.random() - 0.5) * 25,
                (Math.random() - 0.5) * 25
              ]}
              rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]}
              scale={[scale, scale, scale]}
              geometry={donut}
              material={matcapMaterial}
            />
          );
        })}

        {/* PLANE */}
        <mesh receiveShadow rotation-x={-Math.PI / 2}>
          <planeBufferGeometry args={[15, 15]} />
          <meshStandardMaterial color={'orange'} />
        </mesh>
      </Canvas>
    </div>
  );
}

export default Lights;

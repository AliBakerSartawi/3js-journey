import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { OrbitControls, useHelper, Loader } from '@react-three/drei';
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
const textString = `marrajaho tamreejan`;
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
function Motion({ textMesh, textMesh2, donut }) {
  // if not inside a useEffect, will give ref undefined error
  useEffect(() => {
    // easy centering solution instead of computing bounding box and manually translating to -50%'s
    textMesh.current.geometry.center();
    textMesh2.current.geometry.center();
  }, [textMesh, textMesh2]);
  // useFrame(({clock: {elapsedTime}}) => {
  //   donut.current.rotation.x = elapsedTime * 0.1
  //   donut.current.rotation.y = elapsedTime * 0.1
  //   // textMesh.current.rotation.x = elapsedTime * 0.1
  //   // textMesh.current.rotation.y = elapsedTime * 0.1
  //   // textMesh.current.rotation.z = elapsedTime * 0.1
  //   // textMesh.current.geometry.center()
  // })
  return null;
}

/**
 * Lights component
 *
 * minimal cost lights  => ambient, hemisphere (because they simulate light, no castShadows)
 *
 * moderate cost lights => directional, point
 *
 * high cost lights     => spot, rectArea
 */
function Lighting() {
  const spotLight = useMemo(
    () => new THREE.SpotLight(0x78ff00, 0.75, 20, Math.PI * 0.1, 0.25, 1),
    []
  );

  const spotLightRotation = useRef();
  const spotLightHelper = useRef();
  const pointLightHelper = useRef();

  // works without adding .current
  useHelper(spotLightHelper, THREE.SpotLightHelper, 'black'); // SpotLightHelper takes a color second arg
  useHelper(pointLightHelper, THREE.PointLightHelper, 1); // PointLightHelper takes a size second arg

  useEffect(() => {
    // it also works without this condition
    // spotLightRotation.current &&
    gsap.to(spotLightRotation.current.position, {
      duration: 2,
      x: -3,
      repeat: -1,
      yoyo: true,
      ease: 'elastic.inOut(1.5, 1)'
      // ease: 'back.out',
    });
    // and it also works without adding the dependency
  }, [spotLightRotation]);
  return (
    <>
      {/* AMBIENT => applies light on every direction, hence, not shadow-related. It simulates light bouncing */}
      {/* <ambientLight args={[0xffffff, 0.5]} /> */}

      {/* DIRECTIONAL => faces the center of the scene (light starts from infinity to center) */}
      {/* <directionalLight
        // castShadow
        position={[2, 3, 4]}
        args={[0xffffff, 0.3]}
      /> */}

      {/* HEMISPHERE => like ambient, but with a color from the sky different from the one from the ground */}
      {/* if the scene has sky and grass, top blue and bottom green colors can give a nice effect */}
      <hemisphereLight args={['orangered', 'orangered', 1]} />

      {/* POINTLIGHT => illuminates in every direction starting from its position */}
      <pointLight
        ref={pointLightHelper}
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
      {/* only works with standard and physical materials */}
      {/* <rectAreaLight
      lookAt={new THREE.Vector3()}
        rotation-x={-Math.PI / 2}
        position={[0, 2.5, 2]}
        args={[0x4effee, 2, 5, 5]}
      /> */}

      {/* SPOTLIGHT => like a flashlight */}
      {/* <spotLight
        castShadow
        position={[0, 5, 5]}
        lookAt={new THREE.Vector3()}
        args={[
          0x78ff00, // color
          0.5, // intensity
          20, // distance (the bigger the longer it takes to fadee)
          Math.PI * 0.1, // angle ()
          0.25, // penumbra => the blurriness at the edges of the light
          1 // decay
        ]}
      /> */}

      {/* to rotate SPOTLIGHT, we need to add its target property to the scene */}
      <>
        <primitive
          ref={spotLightHelper}
          object={spotLight}
          castShadow
          position={[0, 5, 5]}
        />
        <primitive
          ref={spotLightRotation}
          object={spotLight.target}
          position={[3, 0, 0]}
        />
      </>
    </>
  );
}

/**
 * Donuts component
 */
function Donuts() {
  const donut = new THREE.TorusBufferGeometry(0.3, 0.2, 20, 45);
  const arr = new Array(200).fill(0);

  const [matcap7Texture] = useLoader(THREE.TextureLoader, [matcap7]);
  const matcapMaterial = new THREE.MeshMatcapMaterial({
    matcap: matcap7Texture
  });

  return (
    <>
      {arr.map((e, i) => {
        const scale = Math.random();
        return (
          <mesh
            key={Math.random() + i}
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
    </>
  );
}

/**
 * Main Component
 */
function Lights() {
  const textMesh = useRef();
  const textMesh2 = useRef();
  const donutRef = useRef();

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
        <mesh castShadow ref={textMesh} position={[0, 1, -1]}>
          <textBufferGeometry args={[textString, textOptions]} />
          <meshStandardMaterial color={'crimson'} />
        </mesh>

        <mesh castShadow ref={textMesh2} position={[0, 1, 1]}>
          <textBufferGeometry args={[textString2, textOptions]} />
          <meshStandardMaterial color={'limegreen'} />
        </mesh>

        {/* DONUTS */}
        <Donuts />

        {/* PLANE */}
        <mesh receiveShadow rotation-x={-Math.PI / 2}>
          <planeBufferGeometry args={[25, 25]} />
          <meshStandardMaterial color={'orange'} />
        </mesh>
      </Canvas>
    </div>
  );
}

export default Lights;

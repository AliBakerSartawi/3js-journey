import React, { useEffect, useMemo, useRef } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls, useHelper } from '@react-three/drei';
import * as THREE from 'three';
import * as dat from 'dat.gui';

/**
 * texture imports
 */
// door
import doorColor from '../textures/door/basecolor.jpg';
import doorAmbientOcclusion from '../textures/door/ambientOcclusion.jpg';
import doorHeight from '../textures/door/height.png';
import doorMetallic from '../textures/door/metallic.jpg';
import doorNormal from '../textures/door/normal.jpg';
import doorOpacity from '../textures/door/opacity.jpg'; // opacity is also called alpha
import doorRoughness from '../textures/door/roughness.jpg';
// brick
import brickColor from '../textures/bricks/color.jpg';
import brickNormal from '../textures/bricks/normal.jpg';
import brickRoughness from '../textures/bricks/roughness.jpg';
import brickAO from '../textures/bricks/ambientOcclusion.jpg';
// grass
import grassColor from '../textures/grass/color.jpg';
import grassNormal from '../textures/grass/normal.jpg';
import grassRoughness from '../textures/grass/roughness.jpg';
import grassAO from '../textures/grass/ambientOcclusion.jpg';

const gui = new dat.GUI({ width: 400 });

function HauntedHouse() {
  const floor = useRef();
  const door = useRef();
  const walls = useRef();
  const doorLight = useRef();
  // useHelper(doorLight, THREE.PointLightHelper)

  // reusable geometries and materials
  const bushGeo = useMemo(() => new THREE.SphereBufferGeometry(1, 16, 16), []);
  const bushMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#89c854' }),
    []
  );
  const graveGeo = useMemo(
    () => new THREE.BoxBufferGeometry(0.6, 0.8, 0.2),
    []
  );
  const graveMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#b2b6b1' }),
    []
  );

  // loading textures
  const [
    doorColorTexture,
    doorAmbientOcclusionTexture,
    doorHeightTexture,
    doorMetallicTexture,
    doorNormalTexture,
    doorOpacityTexture,
    doorRoughnessTexture,
    brickColorTexture,
    brickNormalTexture,
    brickRoughnessTexture,
    brickAOTexture,
    grassColorTexture,
    grassNormalTexture,
    grassRoughnessTexture,
    grassAOTexture
  ] = useLoader(THREE.TextureLoader, [
    doorColor,
    doorAmbientOcclusion,
    doorHeight,
    doorMetallic,
    doorNormal,
    doorOpacity,
    doorRoughness,
    brickColor,
    brickNormal,
    brickRoughness,
    brickAO,
    grassColor,
    grassNormal,
    grassRoughness,
    grassAO
  ]);

  // repeat grass texture for floor
  grassColorTexture.repeat.set(8, 8);
  grassNormalTexture.repeat.set(8, 8);
  grassRoughnessTexture.repeat.set(8, 8);
  grassAOTexture.repeat.set(8, 8);
  // wrapS
  grassColorTexture.wrapS = THREE.RepeatWrapping;
  grassNormalTexture.wrapS = THREE.RepeatWrapping;
  grassRoughnessTexture.wrapS = THREE.RepeatWrapping;
  grassAOTexture.wrapS = THREE.RepeatWrapping;
  // wrapT
  grassColorTexture.wrapT = THREE.RepeatWrapping;
  grassNormalTexture.wrapT = THREE.RepeatWrapping;
  grassRoughnessTexture.wrapT = THREE.RepeatWrapping;
  grassAOTexture.wrapT = THREE.RepeatWrapping;

  useEffect(() => {
    setTimeout(() => {
      // guiInit();
      guiAdd(floor.current);
    }, 50);
  }, []);
  return (
    <div
      style={{ height: '100vh', backgroundColor: '#262847' /* same as fog */ }}
    >
      <Canvas
        shadows
        camera={{
          fov: 45,
          position: [8, 8, 8],
          near: 0.1,
          far: 2000
        }}
      >
        <axesHelper args={[10, 10]} />
        <OrbitControls />
        {/* FOG */}
        <fog attach="fog" args={['#262847', 0, 20]} />

        {/* PLANE */}
        <mesh ref={floor} name="plane" receiveShadow rotation-x={-Math.PI / 2}>
          <planeBufferGeometry args={[20, 20]} />
          <meshStandardMaterial
            map={grassColorTexture} // we need to set all its textures to repeat
            normalMap={grassNormalTexture}
            normalScale={[1, 1]}
            roughnessMap={grassRoughnessTexture}
            roughness={1}
            aoMap={grassAOTexture}
            aoMapIntensity={10}
          />
          <ApplyAOMap plane={floor} />
        </mesh>

        {/* HOUSE => group */}
        <group>
          {/* WALLS */}
          <mesh ref={walls} castShadow name="walls" position-y={2.5 / 2}>
            <boxBufferGeometry args={[4, 2.5, 4]} />
            <meshStandardMaterial
              map={brickColorTexture}
              normalMap={brickNormalTexture}
              normalScale={[1, 1]}
              roughnessMap={brickRoughnessTexture}
              roughness={1}
              aoMap={brickAOTexture}
              aoMapIntensity={5}
            />
            <ApplyAOMap plane={walls} />
          </mesh>
          {/* ROOF */}
          <mesh
            castShadow
            name="roof"
            rotation-y={Math.PI / 4}
            position-y={2.5 + 0.5}
          >
            <coneBufferGeometry args={[3.5, 1, 4]} />
            <meshStandardMaterial color={'#b35f45'} />
          </mesh>
          {/* DOOR */}
          <mesh ref={door} name="door" position={[0, 1, 2 + 0.01]}>
            <planeBufferGeometry args={[2.2, 2.2, 100, 100]} />
            <meshStandardMaterial
              map={doorColorTexture}
              transparent
              alphaMap={doorOpacityTexture}
              aoMap={doorAmbientOcclusionTexture}
              aoMapIntensity={10}
              displacementMap={doorHeightTexture}
              displacementScale={0.1}
              normalMap={doorNormalTexture}
              normalScale={[1, 1]}
              metalnessMap={doorMetallicTexture}
              metalness={1}
              roughnessMap={doorRoughnessTexture}
              roughness={1}
            />
            <ApplyAOMap plane={door} />
          </mesh>
          <pointLight
            name="doorLight"
            ref={doorLight}
            castShadow
            args={['#ff7d46', 1, 7]}
            position={[0, 2.2, 2.7]}
          />
          {/* BUSHES */}
          <mesh
            castShadow
            name="bush1"
            geometry={bushGeo}
            material={bushMat}
            scale={[0.5, 0.5, 0.5]}
            position={[0.8, 0.2, 2.2]}
          />
          <mesh
            castShadow
            name="bush2"
            geometry={bushGeo}
            material={bushMat}
            scale={[0.25, 0.25, 0.25]}
            position={[1.4, 0.1, 2.1]}
          />
          <mesh
            castShadow
            name="bush3"
            geometry={bushGeo}
            material={bushMat}
            scale={[0.4, 0.4, 0.4]}
            position={[-0.8, 0.1, 2.2]}
          />
          <mesh
            castShadow
            name="bush4"
            geometry={bushGeo}
            material={bushMat}
            scale={[0.15, 0.15, 0.15]}
            position={[-1, 0.05, 2.6]}
          />

          {/* GRAVES */}
          <group name="graves">
            {new Array(50).fill(0).map((e, i) => {
              const angle = Math.random() * Math.PI * 2; // to get random point on a full circle
              const radius = 3.5 + Math.random() * 6;
              const randomRotation = (Math.random() - 0.5) * 0.5;
              const x = Math.sin(angle) * radius;
              const z = Math.cos(angle) * radius;
              return (
                <mesh
                  key={Math.random() + i}
                  castShadow
                  geometry={graveGeo}
                  material={graveMat}
                  position={[x, 0.3, z]}
                  rotation={[0, randomRotation, randomRotation]}
                />
              );
            })}
          </group>
        </group>

        <Lights />
      </Canvas>
    </div>
  );
}

export default HauntedHouse;

/**
 * Lights Component
 */
function Lights() {
  const ambient = useRef();
  const moonlight = useRef();
  const moonlightShadowHelper = useRef();

  // useHelper(moonlight, THREE.DirectionalLightHelper)
  // useHelper(moonlightShadowHelper, THREE.CameraHelper)

  useEffect(() => {
    moonlightShadowHelper.current = moonlight.current.shadow.camera;
  }, [moonlight]);

  useEffect(() => {
    setTimeout(() => {
      guiAddLights(ambient.current, moonlight.current);
    }, 50);
  }, []);
  return (
    <>
      {/* fog can be added to the light component as well */}
      <ambientLight ref={ambient} args={['#b9d5ff', 0.12]} />
      <directionalLight
        name="moonlight"
        ref={moonlight}
        position={[4, 5, -2]}
        args={['#b9d5ff', 0.12]}
        lookAt={new THREE.Vector3()}
        // shadows
        castShadow
        shadow-mzpSize={(1024, 1024)}
        shadow-camera-top={10}
        shadow-camera-right={15}
        shadow-camera-bottom={-10}
        shadow-camera-left={-15}
        shadow-camera-near={-5}
        shadow-camera-far={20}
      />
      {/* the door light is added in the house group */}
    </>
  );
}

/**
 * ApplyAOMap Component
 */
function ApplyAOMap({ plane }) {
  useEffect(() => {
    plane.current &&
      plane.current.geometry.setAttribute(
        'uv2',
        // also BufferAttribute without Float32 works
        new THREE.Float32BufferAttribute(
          plane.current.geometry.attributes.uv.array,
          2
        )
      );
    console.log('aoMap');
  }, [plane]);

  return null;
}

/**
 * Debug
 */

// function guiInit() {
//   gui = new dat.GUI({ width: 400 });
// }

function guiAdd(plane, sphere) {
  const parameters = {};
}

function guiAddLights(ambient, directional) {
  const folder = gui.addFolder('Lights');
  folder.add(ambient, 'intensity').min(0).max(1).name('Ambient Intensity');
  folder
    .add(directional, 'intensity')
    .min(0)
    .max(1)
    .name('Directional Intensity');
}

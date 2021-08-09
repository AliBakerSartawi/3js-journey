import React, { useEffect, useMemo, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import * as dat from 'dat.gui';

const gui = new dat.GUI({ width: 400 });

function HauntedHouse() {
  const plane = useRef();
  const sphere = useRef();

  const bushGeo = useMemo(() => new THREE.SphereBufferGeometry(1, 16, 16), []);
  const bushMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#89c854' }), []);
  const graveGeo = useMemo(() => new THREE.BoxBufferGeometry(0.6, 0.8, 0.2), []);
  const graveMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#b2b6b1' }), []);

  useEffect(() => {
    setTimeout(() => {
      // guiInit();
      guiAdd(plane.current, sphere.current);
    }, 50);
  }, []);
  return (
    <div style={{ height: '100vh', backgroundColor: 'rgb(26, 26, 26)' }}>
      <Canvas
        camera={{
          fov: 45,
          position: [10, 10, 10],
          near: 0.1,
          far: 2000
        }}
      >
        <axesHelper args={[10, 10]} />
        <OrbitControls />

        {/* PLANE */}
        <mesh name="plane" receiveShadow ref={plane} rotation-x={-Math.PI / 2}>
          <planeBufferGeometry args={[20, 20]} />
          <meshStandardMaterial color={'seagreen'} />
        </mesh>

        {/* HOUSE => group */}
        <group>
          {/* WALLS */}
          <mesh name="walls" position-y={2.5 / 2}>
            <boxBufferGeometry args={[4, 2.5, 4]} />
            <meshStandardMaterial color={'#ac8e82'} />
          </mesh>
          {/* ROOF */}
          <mesh name="roof" rotation-y={Math.PI / 4} position-y={2.5 + 0.5}>
            <coneBufferGeometry args={[3.5, 1, 4]} />
            <meshStandardMaterial color={'#b35f45'} />
          </mesh>
          {/* DOOR */}
          <mesh name="door" position={[0, 1, 2 + 0.01]}>
            <planeBufferGeometry args={[2, 2]} />
            <meshStandardMaterial color={'#aa7b7b'} />
          </mesh>
          {/* BUSHES */}
          <mesh
            name="bush1"
            geometry={bushGeo}
            material={bushMat}
            scale={[0.5, 0.5, 0.5]}
            position={[0.8, 0.2, 2.2]}
          />
          <mesh
            name="bush2"
            geometry={bushGeo}
            material={bushMat}
            scale={[0.25, 0.25, 0.25]}
            position={[1.4, 0.1, 2.1]}
          />
          <mesh
            name="bush3"
            geometry={bushGeo}
            material={bushMat}
            scale={[0.4, 0.4, 0.4]}
            position={[-0.8, 0.1, 2.2]}
          />
          <mesh
            name="bush4"
            geometry={bushGeo}
            material={bushMat}
            scale={[0.15, 0.15, 0.15]}
            position={[-1, 0.05, 2.6]}
          />

          {/* GRAVES */}
          <group name="graves">
            {new Array(50).fill(0).map((e, i) => {
              const angle = Math.random() * Math.PI * 2 // to get random point on a full circle
              const radius = 3.5 + (Math.random() * 6)
              const randomRotation = (Math.random() - 0.5) * 0.5;
              const x = Math.sin(angle) * radius
              const z = Math.cos(angle) * radius
              return (
                <mesh geometry={graveGeo} material={graveMat} position={[x, 0.3, z]} rotation={[0, randomRotation, randomRotation]} />
              )
            })}
          </group>
        </group>

        <Lights />
      </Canvas>
    </div>
  );
}

export default HauntedHouse;

function Lights() {
  const ambient = useRef();
  const directional = useRef();

  useEffect(() => {
    setTimeout(() => {
      guiAddLights(ambient.current, directional.current);
    }, 50);
  }, []);
  return (
    <>
      <ambientLight ref={ambient} args={[0xffffff, 0.5]} />
      <directionalLight
        ref={directional}
        castShadow
        position={[3, 3, -3]}
        args={[0xffffff, 0.5]}
        lookAt={new THREE.Vector3()}
      />
    </>
  );
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
  folder.add(directional, 'intensity').min(0).max(1).name('Directional Intensity');
}

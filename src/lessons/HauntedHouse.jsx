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
  const bushMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#89c854' }),
    []
  );

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
        <mesh receiveShadow ref={plane} rotation-x={-Math.PI / 2}>
          <planeBufferGeometry args={[15, 15]} />
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
          <mesh rotation-y={Math.PI / 4} position-y={2.5 + 0.5}>
            <coneBufferGeometry args={[3.5, 1, 4]} />
            <meshStandardMaterial color={'#b35f45'} />
          </mesh>
          {/* DOOR */}
          <mesh position={[0, 1, 2 + 0.01]}>
            <planeBufferGeometry args={[2, 2]} />
            <meshStandardMaterial color={'#aa7b7b'} />
          </mesh>
          {/* BUSHES */}
          <mesh
            geometry={bushGeo}
            material={bushMat}
            scale={[0.5, 0.5, 0.5]}
            position={[0.8, 0.2, 2.2]}
          />
          <mesh
            geometry={bushGeo}
            material={bushMat}
            scale={[0.25, 0.25, 0.25]}
            position={[1.4, 0.1, 2.1]}
          />
          <mesh
            geometry={bushGeo}
            material={bushMat}
            scale={[0.4, 0.4, 0.4]}
            position={[-0.8, 0.1, 2.2]}
          />
          <mesh
            geometry={bushGeo}
            material={bushMat}
            scale={[0.15, 0.15, 0.15]}
            position={[-1, 0.05, 2.6]}
          />
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
      <ambientLight ref={ambient} args={[0xffffff, 0.3]} />
      <directionalLight
        ref={directional}
        castShadow
        position={[2, 2, 2]}
        args={[0xffffff, 0.7]}
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
  folder
    .add(directional, 'intensity')
    .min(0)
    .max(1)
    .name('Directional Intensity');
}

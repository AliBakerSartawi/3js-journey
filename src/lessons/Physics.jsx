import React, { useRef, useState } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { Physics, useBox, usePlane, useSphere } from '@react-three/cannon';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import DatGui, {
  DatFolder,
  DatColor,
  DatNumber,
  DatSelect,
  DatBoolean
} from 'react-dat-gui';
import 'react-dat-gui/dist/index.css';

/**
 * Plane
 */
function Plane(props) {
  const [plane] = usePlane(() => ({
    mass: 0,
    type: 'Static', // if mass is 0, type defaults automatically to static
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, 0, 0],
    args: [25, 25],
    material: 'concrete'
    // material: {
    //   friction: 1, // rub
    //   restitution: 1, // bounce => default is 0.3 (maybe only in vanilla CANNON)
    // },
  }));
  return (
    <mesh
      ref={plane}
      receiveShadow
      // rotation-x={-Math.PI / 2}
    >
      <planeBufferGeometry args={[25, 25]} />
      <meshStandardMaterial color={'grey'} />
    </mesh>
  );
}

/**
 * Box
 */
function Box({ color, x, y, z }) {
  const [box] = useBox(() => ({
    mass: 0.25,
    position: [x, y, z],
    rotation: [
      (Math.random() * Math.PI) / 2,
      (Math.random() * Math.PI) / 2,
      (Math.random() * Math.PI) / 2
    ],
    args: [0.5, 0.5, 0.5]
  }));
  return (
    <mesh
      ref={box}
      castShadow
      // position={[0, 5, 0]}
    >
      <boxBufferGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

/**
 * Sphere
 */
function Sphere(props) {
  const [sphere] = useSphere(() => ({
    mass: 1,
    args: [1],
    position: [0, 0.75, 0]
  }));
  return (
    <mesh castShadow ref={sphere}>
      <sphereBufferGeometry args={[1]} />
      <meshStandardMaterial color={'lightgrey'} />
    </mesh>
  );
}

/**
 * Main Component
 */
function Template() {
  // state
  const [opts, setOpts] = useState({
    datGuiWidth: 350
  });

  return (
    <div style={{ height: '100vh', backgroundColor: 'black' }}>
      <Canvas
        shadows
        camera={{
          fov: 45,
          position: [15, 10, 15],
          near: 0.1,
          far: 2000
        }}
      >
        <axesHelper args={[10]} />
        <OrbitControls />

        <Physics
          // Earth's default gravity constant
          gravity={[0, -9.82, 0]}
          defaultContactMaterial={{ 
            friction: 1, // rub 
            restitution: 0.01 // bounce => default=0.3, (try 1 && 0.01)
           }}
        >
          <Plane />
          {/* Raining Boxes */}
          {new Array(50).fill(1).map((box, i) => {
            const colors = ['lime', 'orange', 'royalblue', 'crimson'];
            const colorIndex = i % 4;
            const x = Math.random() < 0.5 ? 1 : -1;
            const z = Math.random() < 0.5 ? 1 : -1;
            return (
              <Box
                key={Math.random() * i}
                x={x}
                y={i + 3}
                z={z}
                color={colors[colorIndex]}
              />
            );
          })}
          <Sphere />
        </Physics>

        <Lights />
      </Canvas>
      <DebugPanel opts={opts} setOpts={setOpts} />
    </div>
  );
}

export default Template;

function Lights() {
  return (
    <>
      <hemisphereLight args={[0xe1e1e1, 0xe1e1e1, 1]} />
      <pointLight
        castShadow
        args={[0xe1e1e1, 1, 20, 1]}
        position={[-5, 5, 5]}
      />
    </>
  );
}

function DebugPanel({ opts, setOpts }) {
  return (
    <DatGui
      data={opts}
      onUpdate={setOpts}
      style={{ width: `${opts.datGuiWidth}px` }}
    >
      <DatFolder closed={false} title="Panel">
        <DatNumber
          label="Panel Width"
          path="datGuiWidth"
          min={300}
          max={500}
          step={1}
        />
      </DatFolder>
    </DatGui>
  );
}

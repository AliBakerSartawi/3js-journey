import React, { useRef, useState } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { Physics, useBox, usePlane } from '@react-three/cannon';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

/**
 * DatGui Import and Styles
 * good example => https://codesandbox.io/embed/troika-3d-text-via-react-three-fiber-ntfx2?fontsize=14
 */
// import "react-dat-gui/build/react-dat-gui.css";
import 'react-dat-gui/dist/index.css';
import DatGui, {
  DatFolder,
  DatColor,
  DatNumber,
  DatSelect,
  DatBoolean
} from 'react-dat-gui';

/**
 * Plane
 */
function Plane(props) {
  const [plane] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, 0, 0],
    ...props
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
function Box(props) {
  const [box] = useBox(() => ({
    mass: 1,
    position: [0, props.y, 0],
    rotation: [
      (Math.random() * Math.PI) / 2,
      (Math.random() * Math.PI) / 2,
      (Math.random() * Math.PI) / 2
    ],
    ...props
  }));
  return (
    <mesh
      ref={box}
      castShadow
      // position={[0, 5, 0]}
    >
      <boxBufferGeometry args={[1, 1, 1]} />
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
        // gravity={[0, -10, 0]}
         >
          <Plane />
          <Box y={3} />
          <Box y={4} />
          <Box y={5} />
          <Box y={6} />
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

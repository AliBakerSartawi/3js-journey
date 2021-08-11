import React, { useRef, useState } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
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
 * Main Component
 */
function Physics() {
  // refs
  const plane = useRef();
  const cube = useRef();

  // state
  const [opts, setOpts] = useState({
    datGuiWidth: 350
  });

  return (
    <div style={{ height: '100vh', backgroundColor: 'rgb(0,0,0)' }}>
      <Canvas
        shadows
        camera={{
          fov: 45,
          position: [5, 3, 5],
          near: 0.1,
          far: 2000
        }}
      >
        <axesHelper args={[10]} />
        <OrbitControls />

        {/* PLANE */}
        <mesh ref={plane} receiveShadow rotation-x={-Math.PI / 2}>
          <planeBufferGeometry args={[10, 10]} />
          <meshStandardMaterial color={'orangered'} />
        </mesh>

        {/* CUBE */}
        <mesh ref={cube} castShadow position-y={0.5}>
          <boxBufferGeometry args={[1, 1]} />
          <meshStandardMaterial color={'royalblue'} />
        </mesh>
        <Lights />
      </Canvas>
      <DebugPanel opts={opts} setOpts={setOpts} />
    </div>
  );
}

export default Physics;

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

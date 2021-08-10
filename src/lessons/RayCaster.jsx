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
function Template() {
  // refs
  const plane = useRef();
  const cube = useRef();

  // state
  const [opts, setOpts] = useState({
    datGuiWidth: 350
  })

  return (
    <div style={{ height: '100vh', backgroundColor: 'rgb(0,0,0)' }}>
      <Canvas
        camera={{
          fov: 45,
          position: [0, 3, 3],
          near: 0.1,
          far: 2000
        }}
      >
        <axesHelper args={[10]} />
        <OrbitControls />

        {/* PLANE */}
        <mesh ref={plane} rotation-x={-Math.PI / 2}>
          <planeBufferGeometry args={[10, 10]} />
          <meshBasicMaterial color={'gray'} />
        </mesh>

        {/* CUBE */}
        <mesh ref={cube} position-y={0.5}>
          <boxBufferGeometry args={[1, 1]} />
          <meshBasicMaterial color={'crimson'} />
        </mesh>
        
      </Canvas>
      <DebugPanel opts={opts} setOpts={setOpts} />
    </div>
  );
}

export default Template;

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

function AnimateParticles({ particles }) {
  useFrame(({ clock: { elapsedTime }, camera }) => {
    particles.current.rotation.y = elapsedTime * 0.05;
    particles.current.rotation.z = elapsedTime * 0.001;
    // camera.rotation.z = elapsedTime * 0.01;
  });
  return null;
}

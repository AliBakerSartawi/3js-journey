import React, { useRef, useState } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

/**
 * DatGui Import and Styles
 */
import 'react-dat-gui/dist/index.css';
import DatGui, {
  DatFolder,
  DatColor,
  DatNumber,
  DatSelect,
  DatBoolean
} from 'react-dat-gui';

/**
 * Ray Caster Usage
 *  1. detect wall in front of player
 *  2. test if laser gun hit something
 *  3. test if something is currently under the mouse to simulate mouse events
 *  4. show an alert message if the spaceship is heading toward a planet
 */

/**
 * Main Component
 */
function RayCaster() {
  // refs
  const plane = useRef();
  const raycaster = useRef();

  // state
  const [opts, setOpts] = useState({
    datGuiWidth: 350
  });

  return (
    <div style={{ height: '100vh', backgroundColor: 'rgb(0,0,0)' }}>
      <Canvas
        camera={{
          fov: 45,
          position: [5, 5, 5],
          near: 0.1,
          far: 2000
        }}
      >
        <axesHelper args={[10]} />
        <OrbitControls />

        {/* PLANE */}
        <mesh ref={plane} rotation-x={-Math.PI / 2}>
          <planeBufferGeometry args={[10, 10]} />
          <meshBasicMaterial color={'lightgreen'} />
        </mesh>

        {/* SPHERES */}
        <mesh position={[0, 0.5, -2]}>
          <sphereBufferGeometry args={[0.5]} />
          <meshBasicMaterial color={'seagreen'} />
        </mesh>
        <mesh position={[0, 0.5, 0]}>
          <sphereBufferGeometry args={[0.5]} />
          <meshBasicMaterial color={'seagreen'} />
        </mesh>
        <mesh position={[0, 0.5, 2]}>
          <sphereBufferGeometry args={[0.5]} />
          <meshBasicMaterial color={'seagreen'} />
        </mesh>

        {/* RAYCASTER */}
        <raycaster
          ref={raycaster}
          args={[
            [0, 0, 5], // origin
            [0, 0, -5] // direction
          ]}
        />
        <RayCasterHelper raycaster={raycaster} />
      </Canvas>
      <DebugPanel opts={opts} setOpts={setOpts} />
    </div>
  );
}

export default RayCaster;

function RayCasterHelper({ raycaster }) {
  useFrame(({ clock: { elapsedTime } }) => {
    if (elapsedTime > 1 && elapsedTime < 2) {
      console.log(raycaster.current);
    }
  });
  return null;
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

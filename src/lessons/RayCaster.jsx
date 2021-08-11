import React, { useEffect, useRef, useState } from 'react';
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
  const sphere1 = useRef();
  const sphere2 = useRef();
  const sphere3 = useRef();

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
          <meshBasicMaterial wireframe color={'lightgreen'} />
        </mesh>

        {/* SPHERES */}
        <mesh ref={sphere1} position={[-2, 0, 0]}>
          <sphereBufferGeometry args={[0.5]} />
          <meshBasicMaterial color={'seagreen'} />
        </mesh>
        <mesh ref={sphere2} position={[0, 0, 0]}>
          <sphereBufferGeometry args={[0.5]} />
          <meshBasicMaterial color={'seagreen'} />
        </mesh>
        <mesh ref={sphere3} position={[2, 0, 0]}>
          <sphereBufferGeometry args={[0.5]} />
          <meshBasicMaterial color={'seagreen'} />
        </mesh>

        {/* RAYCASTER */}
        <raycaster
          ref={raycaster}
          // these args must be passed as new instances of Vector3 manually
          args={[
            new THREE.Vector3(-3, 0, 0), // origin
            new THREE.Vector3(10, 0, 0).normalize() // direction, must be normalized
          ]}
        />
        <RayCasterHelper
          raycaster={raycaster}
          spheres={{ sphere1, sphere2, sphere3 }}
        />
      </Canvas>
      <DebugPanel opts={opts} setOpts={setOpts} />
    </div>
  );
}

export default RayCaster;

function RayCasterHelper({
  raycaster,
  spheres: { sphere1, sphere2, sphere3 }
}) {
  // useFrame(({ clock: { elapsedTime } }) => {
  //   if (elapsedTime > 1 && elapsedTime < 1.2) {
  //     console.log(raycaster.current);
  //   }
  // });

  useEffect(() => {
    // raycaster.current.set(
    //   new THREE.Vector3(0,0,5), // origin
    //   new THREE.Vector3(0,0,-5).normalize() // direction, must be normalized
    // )
    console.log(raycaster.current);
    const intersect = raycaster.current.intersectObject(sphere1.current);
    console.log(intersect);
    const intersects = raycaster.current.intersectObjects([
      sphere1.current,
      sphere2.current,
      sphere3.current
    ]);
    console.log(intersects);
  }, [raycaster, sphere1, sphere2, sphere3]);
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

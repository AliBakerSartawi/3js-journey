import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { Physics, useBox, usePlane, useSphere } from '@react-three/cannon';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useControls } from 'leva';
import hit from '../sounds/hit.mp3'

/**
 * THREE.js rendering is on GPU
 * But, physics still run on CPU
 */

/**
 * Hit Sound
 */
const hitSound = new Audio(hit)
function playHitSound(collision) {
  // impact strength => to remove unnecessary repetition
  const impact = collision.contact.impactVelocity
  const impactVolume = impact > 10 ? 1 : impact / 10
  
  if (impact > 1) { // or 1.5
    // reset sound if there is a new collision before the previous sound ended
    // if not reset, the current collision sound will be delayed until the previous ends
    hitSound.volume = impactVolume / 2 // or Math.random()
    hitSound.currentTime = 0
    hitSound.play()
  }
}

/**
 * Plane
 */
function Plane({ position, rotation, color }) {
  const { receiveShadow } = useControls({ receiveShadow: true });
  const [plane, api] = usePlane(() => ({
    mass: 0,
    type: 'Static', // if mass is 0, type defaults automatically to static
    rotation,
    position,
    args: [25, 25],
    // onCollide: e => {
    //   playHitSound(e)
    // }
    // // no need for material here, just add it defaultContactMaterial to Physics and that's enough for most projects
    // material: 'concrete',
    // material: {
    //   friction: 1, // rub
    //   restitution: 1, // bounce => default is 0.3 (maybe only in vanilla CANNON)
    // },
  }));
  return (
    <mesh ref={plane} receiveShadow={receiveShadow}>
      <planeBufferGeometry args={[25, 25]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

function PlaneAndWalls() {
  return (
    <>
      {/* PLANE */}
      <Plane
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        color={'grey'}
      />
      {/* WALLS */}
      <Plane rotation={[0, 0, 0]} position={[0, 12.5, -12.5]} color={'grey'} />
      <Plane
        rotation={[Math.PI, 0, 0]}
        position={[0, 12.5, 12.5]}
        color={'grey'}
      />
      <Plane
        rotation={[0, -Math.PI / 2, 0]}
        position={[12.5, 12.5, 0]}
        color={'grey'}
      />
      <Plane
        rotation={[0, Math.PI / 2, 0]}
        position={[-12.5, 12.5, 0]}
        color={'grey'}
      />
    </>
  );
}

/**
 * Box
 */
function Box({ geometry, color, x, y, z }) {
  const random = Math.random();
  const randomForce = (random - 0.5) * 2;
  const [box, api] = useBox(() => ({
    mass: 0.25,
    position: [x, y, z - 10],
    rotation: [
      (Math.random() * Math.PI) / 2,
      (Math.random() * Math.PI) / 2,
      (Math.random() * Math.PI) / 2
    ],
    args: [random, random, random],

    // placing a sound on boxes collision will result in a funny radio static effect, don't do it
    // onCollide: (e) => {
    //   playHitSound()
    // }
  }));

  useFrame(({ clock: { elapsedTime } }) => {
    // // mimicking wind
    // api.applyForce([randomForce, 0, randomForce], [0, 0, 0]);
    api.applyForce(
      [-Math.sin(elapsedTime) * 2, 0, -Math.cos(elapsedTime) * 2],
      [0, 0, 0]
    );
  });

  return (
    <mesh
      ref={box}
      castShadow
      geometry={geometry}
      scale={[random, random, random]}
    >
      {/* <boxBufferGeometry args={[random, random, random]} /> */}
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

function Boxes() {
  const { boxes } = useControls({
    boxes: { value: 50, min: 1, max: 100, step: 1 }
  });
  const geometry = new THREE.BoxBufferGeometry(1, 1, 1);
  return (
    <>
      {new Array(boxes).fill(1).map((box, i) => {
        const colors = ['lime', 'orange', 'royalblue', 'crimson'];
        const colorIndex = i % 4;
        const x = Math.random() < 0.5 ? 1 : -1;
        const z = Math.random() < 0.5 ? 1 : -1;
        return (
          <Box
            key={Math.random() * i}
            geometry={geometry}
            x={x}
            y={i + 3}
            z={z}
            color={colors[colorIndex]}
          />
        );
      })}
    </>
  );
}

/**
 * Sphere
 */
function Sphere(props) {
  const { sphereSpeed } = useControls({
    sphereSpeed: { value: 10, min: 1, max: 50, step: 0.1 }
  });
  const [sphere, api] = useSphere(() => ({
    mass: 1,
    args: [1],
    position: [0, 3, 0],
    onCollide: (e) => {
      playHitSound(e)
    }
  }));

  useFrame(({ clock: { elapsedTime } }) => {
    api.applyForce(
      [
        Math.sin(elapsedTime) * sphereSpeed,
        0,
        Math.cos(elapsedTime) * sphereSpeed
      ],
      [0, 0, 0]
    );
  });

  useEffect(() => {
    // // force local to the sphere
    // api.applyLocalForce([0, 500, 0], [0,0,0])
    // OR, even better => using applyForce to the position of the sphere
    const { x, y, z } = sphere.current.position;
    api.applyForce([0, -500, 0], [x, y, z]);
  }, [api, sphere]);

  return (
    <mesh castShadow receiveShadow ref={sphere}>
      <sphereBufferGeometry args={[1]} />
      <meshStandardMaterial color={'lightgrey'} />
    </mesh>
  );
}

/**
 * Main Component
 */
function PhysicsComponent() {
  // state
  const [opts, setOpts] = useState({
    datGuiWidth: 350
  });

  const { gravity, bounce, friction } = useControls({
    gravity: { value: -9.82, min: -9.82, max: 0, step: 0.1 }
    // bounce: { value: 5, min: 0, max: 10, step: 0.1 },
    // friction: { value: 1, min: 0, max: 10, step: 0.1 },
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
        {/* <axesHelper args={[10]} /> */}
        <OrbitControls />

        <Physics
          // Earth's default gravity constant
          gravity={[0, gravity, 0]}
          defaultContactMaterial={{
            friction: 1, // rub
            // restitution === bounce
            // default=0.3, (try 1 && 0.01)
            // if > 1, bounce will be higher than gravity (higher than original position if object is falling)
            restitution: 0.7
          }}
          // Naive will test a body with all other bodies on each collision
          // SAP (sweep and prune) tests bodies on arbitrary aces during multiple steps
          // SAP is way better for performance
          // ... but, if object is moving too fast, it might phase through
          broadphase={'SAP'}
          // allowing sleep will drastically improve performance
          // while true, won't test slow/non-moving objects
          allowSleep={true}
        >
          {/* plane and walls */}
          <PlaneAndWalls />
          {/* Raining Boxes */}
          <Boxes />
          <Sphere />
        </Physics>

        <Lights />
      </Canvas>
    </div>
  );
}

export default PhysicsComponent;

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

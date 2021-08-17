import React, { useRef, useState } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Stats } from '@react-three/drei';
import * as THREE from 'three';
import { useControls, Leva, folder } from 'leva';

/**
 * Main Component
 */
function AnimatedGalaxy() {
  const particles = useRef();

  const {
    size,
    sizeAttenuation,
    depthWrite,
    blending,
    vertexColors,
    count,
    radius,
    branches,
    spin,
    randomness,
    randomnessPower,
    insideColor,
    outsideColor
  } = useControls({
    particlesMat: folder({
      size: { value: 0.01, min: 0, max: 0.1, step: 0.001 },
      sizeAttenuation: true,
      depthWrite: false,
      blending: true,
      vertexColors: true
      // color: 'white',
    }),
    particlesGeo: folder({
      count: { value: 100000, min: 0, max: 200000, step: 1 },
      radius: { value: 5, min: 1, max: 20, step: 0.01 },
      branches: { value: 3, min: 2, max: 20, step: 1 },
      spin: { value: 1, min: -3, max: 3, step: 0.001 },
      randomness: { value: 1, min: 0, max: 2, step: 0.001 },
      randomnessPower: { value: 3, min: 1, max: 10, step: 0.001 },
      insideColor: '#F13800',
      outsideColor: '#0033B4'
    })
  });

  const particlesGeo = {
    count,
    radius,
    branches,
    spin,
    randomness,
    randomnessPower,
    insideColor,
    outsideColor
  };

  // for custom geometry particles
  const particlesGeometry = customParticleGeometry(particlesGeo);

  return (
    <div style={{ height: '100vh', backgroundColor: 'rgb(0,0,0)' }}>
      <Canvas
        camera={{
          fov: 45,
          position: [0, 7, 7],
          near: 0.1,
          far: 2000
        }}
      >
        {/* <axesHelper args={[10]} /> */}
        <OrbitControls />

        {/* CUSTOM GEOMETRY PARTICLE */}
        <points
          ref={particles}
          geometry={particlesGeometry}
          geometry-size={0.02}
        >
          <pointsMaterial
            size={size}
            sizeAttenuation={sizeAttenuation}
            depthWrite={depthWrite}
            vertexColors={vertexColors}
            blending={blending ? THREE.AdditiveBlending : THREE.NormalBlending}
          />
          <AnimateParticles particles={particles} />
        </points>
      </Canvas>
      <Stats />
      <Leva />
    </div>
  );
}

export default AnimatedGalaxy;

function AnimateParticles({ particles }) {
  useFrame(({ clock: { elapsedTime }, camera }) => {
    particles.current.rotation.y = elapsedTime * 0.05;
    particles.current.rotation.z = elapsedTime * 0.001;
    // camera.rotation.z = elapsedTime * 0.01;
  });
  return null;
}

function customParticleGeometry({
  count,
  branches,
  radius,
  spin,
  randomness,
  randomnessPower: pow,
  insideColor,
  outsideColor
}) {
  const particlesGeometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const colorInside = new THREE.Color(insideColor);
  const colorOutside = new THREE.Color(outsideColor);

  // // will give perfect mix of the two, but will mutate first variable
  // colorInside.lerp(colorOutside, 0.5);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const randomRadius = Math.random() * radius;

    // example: if branches is 3 ⬇️
    // i               => 0  1   2  3  4   5  6  7  8   9
    // angleModulo     => 0  1   2  0  1   2  0  1  2   0
    // anglePercentage => 0 .33 .66 0 .33 .66 0 .33 .66 0
    // angle           => the real angle value on the circle
    const angleModulo = i % branches;
    const anglePercentage = angleModulo / branches;
    const angle = anglePercentage * Math.PI * 2;

    // spin
    const spinAngle = spin * randomRadius;

    // randomness
    // multiplied by randomRadius to decrease randomness in the center, and increase with distance from center
    // const randomX = (Math.random() - 0.5) * randomness * randomRadius;
    // const randomY = (Math.random() - 0.5) * randomness * randomRadius;
    // const randomZ = (Math.random() - 0.5) * randomness * randomRadius;

    // more randomness
    // pow === randomnessPower
    const randomX =
      Math.pow(Math.random(), pow) *
      (Math.random() < 0.5 ? -1 : 1) *
      Math.pow(randomness, pow);
    const randomY =
      Math.pow(Math.random(), pow) *
      (Math.random() < 0.5 ? -1 : 1) *
      Math.pow(randomness, pow);
    const randomZ =
      Math.pow(Math.random(), pow) *
      (Math.random() < 0.5 ? -1 : 1) *
      Math.pow(randomness, pow);

    // positions x, y, z
    positions[i3 + 0] = Math.cos(angle + spinAngle) * randomRadius + randomX;
    positions[i3 + 1] = Math.random() * randomness * randomY;
    positions[i3 + 2] = Math.sin(angle + spinAngle) * randomRadius + randomZ;

    // Colors
    const mixedColor = colorInside.clone(); // we clone to prevent mutating
    mixedColor.lerp(colorOutside, randomRadius / radius);

    // colors r, g, b
    colors[i3 + 0] = mixedColor.r;
    colors[i3 + 1] = mixedColor.g;
    colors[i3 + 2] = mixedColor.b;
  }

  // setting position attribute
  particlesGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(positions, 3)
  );
  particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  return particlesGeometry;
}

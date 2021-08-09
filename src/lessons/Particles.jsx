import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

/**
 * each particle is composed of a plane (two triangles) always facing the camera
 *
 */

function Particles() {
  // for custom geometry particles
  const particlesGeo = customParticleGeometry(500)

  return (
    <div style={{ height: '100vh', backgroundColor: 'rgb(26, 26, 26)' }}>
      <Canvas
        camera={{
          fov: 45,
          position: [3, 3, 3],
          near: 0.1,
          far: 2000
        }}
      >
        <axesHelper args={[10]} />
        <OrbitControls />

        {/* PARTICLES */}
        <points>
          <sphereBufferGeometry args={[1, 32, 32]} />
          <pointsMaterial
            size={0.02}
            sizeAttenuation={true} // particle size is relative to distance from camera
          />
        </points>

        {/* CUSTOM GEOMETRY PARTICLE */}
        <points geometry={particlesGeo} geometry-size={0.02}>
          <pointsMaterial size={0.02} />
        </points>
      </Canvas>
    </div>
  );
}

export default Particles;

function customParticleGeometry(count) {
  const particlesGeometry = new THREE.BufferGeometry();
  let positions = new Float32Array(count * 3);
  positions = positions.map((p) => (p = (Math.random() - 0.5) * 10));
  particlesGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(positions, 3)
  );
  return particlesGeometry
}
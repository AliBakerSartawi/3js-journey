import React, { useRef, useState } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

/**
 * DatGui Import and Styles
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

// PARTICLE IMPORTS
import p1 from '../textures/particles/1.png';
import p2 from '../textures/particles/2.png';
import p3 from '../textures/particles/3.png';
import p4 from '../textures/particles/4.png';
import p5 from '../textures/particles/5.png';
import p6 from '../textures/particles/6.png';
import p7 from '../textures/particles/7.png';
import p8 from '../textures/particles/8.png';
import p9 from '../textures/particles/9.png';
import p10 from '../textures/particles/10.png';
import p11 from '../textures/particles/11.png';
import p12 from '../textures/particles/12.png';
import p13 from '../textures/particles/13.png';
import { Triangle } from 'three';

/**
 * each particle is composed of a plane (two triangles) always facing the camera
 * download particle textures => https://kenney.nl/assets/particle-pack
 */

/**
 * Main Component
 */
function GalaxyGenerator() {
  // refs
  const particledSphere = useRef();
  const particles = useRef();

  // particle textures
  const [p1T, p2T, p3T, p4T, p5T, p6T, p7T, p8T, p9T, p10T, p11T, p12T, p13T] =
    useLoader(THREE.TextureLoader, [
      p1,
      p2,
      p3,
      p4,
      p5,
      p6,
      p7,
      p8,
      p9,
      p10,
      p11,
      p12,
      p13
    ]);

  const [opts, setOpts] = useState({
    particlesMat: {
      size: 0.01,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: false,
      color: 'white'
    },
    particlesGeo: {
      count: 10000,
      spread: 3,
      randomColors: false
    }
  });

  // for custom geometry particles
  const particlesGeo = customParticleGeometry(
    opts.particlesGeo.count,
    opts.particlesGeo.spread,
    opts.particlesGeo.randomColors
  );

  return (
    <div style={{ height: '100vh', backgroundColor: 'rgb(0,0,0)' }}>
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
        <points ref={particledSphere}>
          <sphereBufferGeometry args={[0.5, 32, 32]} />
          <pointsMaterial
            size={0.02}
            sizeAttenuation={true} // particle size is relative to distance from camera
          />
          <AnimateParticles particles={particledSphere} />
        </points>

        {/* CUSTOM GEOMETRY PARTICLE */}
        <points ref={particles} geometry={particlesGeo} geometry-size={0.02}>
          <pointsMaterial {...opts.particlesMat} />
          <AnimateParticles particles={particles} />
        </points>
      </Canvas>
      <DebugPanel opts={opts} setOpts={setOpts} />
    </div>
  );
}

export default GalaxyGenerator;

function DebugPanel({ opts, setOpts }) {
  return (
    <>
      <DatGui data={opts} onUpdate={setOpts} liveUpdate={false}>
          <DatFolder title="Particles">
            <DatNumber label="size" path="particlesMat.size" min={0} max={0.1} step={0.001} />
            {/* <DatSelect label="texture" path="particlesMat.alphaMap" options={Object.keys(opts.particlesTexture)} /> */}
            <DatNumber label="Count" path="particlesGeo.count" min={0} max={10000} step={1} />
            <DatNumber label="spread" path="particlesGeo.spread" min={1} max={10} step={0.01} />
          </DatFolder>
      </DatGui>
    </>
  );
}

function AnimateParticles({ particles }) {
  useFrame(({ clock: { elapsedTime }, camera }) => {
    particles.current.rotation.y = elapsedTime * 0.05;
    particles.current.rotation.z = elapsedTime * 0.05;
    camera.rotation.z = elapsedTime * 0.1;
  });
  return null;
}

function customParticleGeometry(count, spread, randomColors) {
  const particlesGeometry = new THREE.BufferGeometry();
  // positions
  let positions = new Float32Array(count * 3);
  positions = positions.map((p) => (p = (Math.random() - 0.5) * spread));
  particlesGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(positions, 3)
  );
  // colors
  if (randomColors) {
    // must enable vertexColors in particle Material
    let colors = new Float32Array(count * 3);
    colors = colors.map((p) => (p = Math.random()));
    particlesGeometry.setAttribute(
      'color',
      new THREE.BufferAttribute(colors, 3)
    );
  }
  return particlesGeometry;
}

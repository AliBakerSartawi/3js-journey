import React, { useEffect, useRef } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, useHelper } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

/**
 * EXAMPLES
 * non-3D text => https://codesandbox.io/embed/troika-3d-text-via-react-three-fiber-ntfx2?fontsize=14
 * 3D text => https://www.ilyameerovich.com/simple-3d-text-meshes-in-three-js/
 */

/**
 * font imports and notes
 *
 * convert font to typeface => https://gero3.github.io/facetype.js/
 * or get fonts from /three/examples/fonts
 */
import typefaceFontFromThree from 'three/examples/fonts/helvetiker_regular.typeface.json';
// or load it from src, notice how License file is in same directory as font
import typefaceFont from '../fonts/helvetiker_regular.typeface.json';

const font = new THREE.FontLoader().parse(typefaceFont);
const textString = `';hello!?<>/*&%$#@!'`;
const textOptions = {
  font,
  size: 1,
  height: 0.25,
  // default is 12, 4 is good for small text, 6 || 8 is ideal for performance & quality
  curveSegments: 8
};

/**
 * Camera component
 */
function Motion({ textMesh }) {
  // if not inside a useEffect, will give ref undefined error
  useEffect(() => {
    // easy centering solution instead of computing bounding box and manually translating to -50%'s
    textMesh.current.geometry.center();
  }, [textMesh]);
  // useFrame(({clock: {elapsedTime}}) => {
  //   textMesh.current.rotation.x = elapsedTime * 0.1
  //   textMesh.current.rotation.y = elapsedTime * 0.1
  //   textMesh.current.rotation.z = elapsedTime * 0.1
  //   textMesh.current.geometry.center()
  // })
  return null;
}

/**
 * Lights component
 */
function Lights() {
  return (
    <>
      <ambientLight args={[0xffffff, 0.5]} />
      <pointLight castShadow args={[0xffffff, 0.5]} position={[2, 3, 4]} />
    </>
  );
}

/**
 * Main Component
 */
function Text() {
  const textMesh = useRef();

  return (
    <div style={{ height: '100vh', backgroundColor: 'rgb(26, 26, 26)' }}>
      <Canvas
        shadows
        pixelRatio={Math.min(window.devicePixelRatio, 2)}
        camera={{
          fov: 45,
          position: [3, 3, 3],
          near: 0.1,
          far: 2000
        }}
      >
        <axesHelper args={[10]} />
        <OrbitControls dampingFactor={0.05} />
        <Motion textMesh={textMesh} />
        <Lights />

        {/* MESHES */}

        <mesh ref={textMesh} position={[0, 0.5, 0]}>
          <textBufferGeometry
            // parameters is useful for remembering textOptions, but they must be provided in args as below
            // parameters
            args={[textString, textOptions]}
          />
          <meshStandardMaterial color={'crimson'} />
        </mesh>

        {/* <mesh>
        <boxBufferGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color={'whitesmoke'} />
      </mesh> */}
      </Canvas>
    </div>
  );
}

export default Text;

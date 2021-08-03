import React, { useEffect, useRef } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

// the camera must be used in a component inside the Canvas component
function CameraLog({box}) {
  const { camera } = useThree();
  // console.log(camera);
  console.log(box.current?.position.distanceTo(camera.position))
  return null
}

function BasicScene() {
  const box = useRef();
  

  function log() {
    console.log(box.current.position);
    // length() is the distance between the center of the scene and the object
    console.log(box.current.position.length());
    
    // position.distanceTo(arg) => arg is a Vector3
    // such as position.distanceTo(camera.position)
    // such as position.distanceTo(new THREE.Vector3(1, 0, 3))
    
    // will reduce the length() (distance from center) to 1
    box.current.position.normalize()
    console.log(box.current.position.length());

    // set changes x, y, z coords
    // box.current.position.set(2, 2, 2)
    // console.log(box.current.position.length());
  }

  return (
    // default camera fov is 75 approximately
    <Canvas camera={{ fov: 75, position: [3, 1, 3] }}>
      <OrbitControls />
      <CameraLog box={box} />
      <mesh ref={box} onClick={log} position={[0.5, 0.5, 0.5]}>
        <boxGeometry args={[1, 1, 1]} />
        {/* better way to declare colors is like this "0xff0000" */}
        <meshBasicMaterial color="crimson" />
      </mesh>
    </Canvas>
  );
}

export default BasicScene;

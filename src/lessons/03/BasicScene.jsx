import React, { useEffect, useRef } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three'

const lookAtBox = new THREE.Vector3()

// the camera must be used in a component inside the Canvas component
function CameraLog({ box }) {
  const { camera } = useThree();
  // console.log(camera);
  // console.log(box.current?.position.distanceTo(camera.position));

  ///// lookAt() method
  // the box is moving and camera is following
  // useFrame((state, delta) => {
  //   if (box.current.position.x > 3) {
  //     box.current.position.x = -3
  //   } else {
  //     box.current.position.x += delta * 1
  //   }
  // })

  // useFrame helps in accessing the camera
  useFrame(state => {
    lookAtBox.x = box.current.position.x
    state.camera.lookAt(lookAtBox)
  })
  //// using lookAt() outside useFrame() didn't work for me
  //// lookAt() works on any object, it makes its -z face look at another object

  return null;
}


function BasicScene() {
  const box = useRef();

  function log() {
    // console.log(box.current.position);
    // length() is the distance between the center of the scene and the object
    // console.log(box.current.position.length());

    // position.distanceTo(arg) => arg is a Vector3
    // such as position.distanceTo(camera.position)
    // such as position.distanceTo(new THREE.Vector3(1, 0, 3))

    // will reduce the length() (distance from center) to 1
    // box.current.position.normalize();
    // console.log(box.current.position.length());

    // set changes x, y, z coords
    // box.current.position.set(2, 2, 2)
    // box.current.scale.set(2, 2, 2)
    /// OR target a specific axis => box.current.scale.x

    // this is another way to change rotation order
    // but rotation values must be updated for it to take effect
    box.current.rotation.reorder('XYZ');
    box.current.rotation.set(Math.PI * 0.25, Math.PI * 0.25, 0);
  }

  return (
    // default camera fov is 75 approximately
    <Canvas camera={{ fov: 75, position: [3, 1, 5] }}>
      <axesHelper args={[10]} />
      <OrbitControls />
      <CameraLog box={box} />
      <mesh
        ref={box}
        onClick={log}
        // Math.PI is equal to 180 degrees rotation (half rotation)
        // quarter rotation => Math.PI / 2 OR Math.PI * 0.5
        // read notes at bottom of page for advanced rotation
        rotation={[Math.PI * 0.25, Math.PI * 0.25, 0, 'YXZ']}
        position={[1, 1, 1]}
        // scale prop overrides the geometry args
        scale={[0.5, 0.5, 0.5]}>
        <axesHelper args={[10]} />
        <boxGeometry
          // if args are not specified, defaults are [1, 1, 1]
          args={[1, 1, 1]}
        />
        {/* better way to declare colors is like this "0xff0000" */}
        <meshBasicMaterial color="crimson" />
      </mesh>
    </Canvas>
  );
}

export default BasicScene;

/**
 * gimbal lock is when an axis is not rotating at all
 *
 * in fps games camera, priority is given to y axis before x
 * otherwise, looking left and right can be weird
 * imagine looking left or right while your neck is way down
 * this happens because the order is xyz
 * to fix it, order should be yxz
 * x => up and down
 * y => left and right
 *
 * order is added as fourth parameter to rotation, should be uppercase
 * or by using rotation.reorder() method
 *
 * you'll notice a difference in rotation if order is 'YXZ'
 */

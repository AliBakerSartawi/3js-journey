/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import React, { useRef } from 'react';
import { useGLTF } from '@react-three/drei';

export default function Model(props) {
  const group = useRef();
  const { nodes, materials } = useGLTF('./flightHelmet/FlightHelmet.gltf');
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh
        castShadow
        geometry={nodes.Hose_low.geometry}
        material={materials.HoseMat}
        material-envMap={props.envMap}
        material-envMapIntensity={props.envMapIntensity}
      />
      <mesh
        castShadow
        geometry={nodes.RubberWood_low.geometry}
        material={materials.RubberWoodMat}
        material-envMap={props.envMap}
        material-envMapIntensity={props.envMapIntensity}
      />
      <mesh
        castShadow
        geometry={nodes.GlassPlastic_low.geometry}
        material={materials.GlassPlasticMat}
        material-envMap={props.envMap}
        material-envMapIntensity={props.envMapIntensity}
      />
      <mesh
        castShadow
        geometry={nodes.MetalParts_low.geometry}
        material={materials.MetalPartsMat}
        material-envMap={props.envMap}
        material-envMapIntensity={props.envMapIntensity}
      />
      <mesh
        castShadow
        geometry={nodes.LeatherParts_low.geometry}
        material={materials.LeatherPartsMat}
        material-envMap={props.envMap}
        material-envMapIntensity={props.envMapIntensity}
      />
      <mesh
        castShadow
        geometry={nodes.Lenses_low.geometry}
        material={materials.LensesMat}
        material-envMap={props.envMap}
        material-envMapIntensity={props.envMapIntensity}
      />
    </group>
  );
}

useGLTF.preload('./flightHelmet/FlightHelmet.gltf');

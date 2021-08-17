/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import React, { useEffect, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

export default function Model(props) {
  const group = useRef();
  const { nodes, materials } = useGLTF('./flightHelmet/FlightHelmet.gltf');

  // instead of applying it manually to each material
  for (const key in materials) {
    const material = materials[key];
    // to not apply it to MeshBasicMaterial
    if (material instanceof THREE.MeshStandardMaterial) {
      material.envMap = props.envMap;
      material.envMapIntensity = props.envMapIntensity;
    }
  }

  /**
   * Custom Shader
   */
  // shadow material
  const depthMaterial = new THREE.MeshDepthMaterial({
    depthPacking: THREE.RGBADepthPacking
  });
  useCustomShader(props.allowCustomShader, materials, depthMaterial);

  return (
    <group ref={group} {...props} dispose={null}>
      <mesh
        castShadow={props.shadows}
        receiveShadow={props.shadows}
        geometry={nodes.Hose_low.geometry}
        material={materials.HoseMat}
        customDepthMaterial={depthMaterial}
        // material-envMap={props.envMap}
        // material-envMapIntensity={props.envMapIntensity}
      />
      <mesh
        castShadow={props.shadows}
        receiveShadow={props.shadows}
        geometry={nodes.RubberWood_low.geometry}
        material={materials.RubberWoodMat}
        customDepthMaterial={depthMaterial}
        // material-envMap={props.envMap}
        // material-envMapIntensity={props.envMapIntensity}
      />
      <mesh
        castShadow={props.shadows}
        receiveShadow={props.shadows}
        geometry={nodes.GlassPlastic_low.geometry}
        material={materials.GlassPlasticMat}
        customDepthMaterial={depthMaterial}
        // material-envMap={props.envMap}
        // material-envMapIntensity={props.envMapIntensity}
      />
      <mesh
        castShadow={props.shadows}
        receiveShadow={props.shadows}
        geometry={nodes.MetalParts_low.geometry}
        material={materials.MetalPartsMat}
        customDepthMaterial={depthMaterial}
        // material-envMap={props.envMap}
        // material-envMapIntensity={props.envMapIntensity}
      />
      <mesh
        castShadow={props.shadows}
        receiveShadow={props.shadows}
        geometry={nodes.LeatherParts_low.geometry}
        material={materials.LeatherPartsMat}
        customDepthMaterial={depthMaterial}
        // material-envMap={props.envMap}
        // material-envMapIntensity={props.envMapIntensity}
      />
      <mesh
        castShadow={props.shadows}
        receiveShadow={props.shadows}
        geometry={nodes.Lenses_low.geometry}
        material={materials.LensesMat}
        customDepthMaterial={depthMaterial}
        // material-envMap={props.envMap}
        // material-envMapIntensity={props.envMapIntensity}
      />
    </group>
  );
}

useGLTF.preload('./flightHelmet/FlightHelmet.gltf');

function useCustomShader(isAnimated, materials, depthMaterial) {
  // useFrame outside if statement, cannot be called conditionally
  const customUniforms = useRef({
    uTime: { value: 0 }
  });

  useFrame(({ clock: { elapsedTime } }) => {
    customUniforms.current.uTime.value = elapsedTime;
  });

  if (isAnimated) {
    // adding custom shaders for funny animations
    for (const material in materials) {
      materials[material].onBeforeCompile = (material) => {
        // adding uniforms manually
        material.uniforms.uTime = customUniforms.current.uTime;

        // to add a function outside of (main) function
        material.vertexShader = material.vertexShader.replace(
          '#include <common>',
          `
            #include <common>

            uniform float uTime;

            mat2 get2dRotateMatrix(float _angle) {
              return mat2(cos(_angle), - sin(_angle),
                          sin(_angle), cos(_angle));
            }
            
          `
        );
        // fix normals (for better shadows on the same object)
        material.vertexShader = material.vertexShader.replace(
          '#include <beginnormal_vertex>',
          `
            #include <beginnormal_vertex>

            // float angle = (position.y + 4.0) * sin(uTime * 0.5) * 0.9;
            float angle = sin(position.y + uTime) * 1.5;
            mat2 rotateMatrix = get2dRotateMatrix(angle);

            objectNormal.xz = objectNormal.xz * rotateMatrix;
          `
        )
        // begin_vertex is responsible for positioning the vertices
        // ... it copies (position) attribute into (transformed) vec3 variable
        material.vertexShader = material.vertexShader.replace(
          '#include <begin_vertex>',
          `
            #include <begin_vertex>

            transformed.xz = transformed.xz * rotateMatrix;
          `
        );
        
      };
    }
    // update the custom shadows (fix drop shadow)
    // the below shader code is a just a bit different than the one for the standard material above, so do not combine both in one function 
    depthMaterial.onBeforeCompile = (material) => {
      // adding uniforms manually
      material.uniforms.uTime = customUniforms.current.uTime;

      // to add a function outside of (main) function
      material.vertexShader = material.vertexShader.replace(
        '#include <common>',
        `
          #include <common>

          uniform float uTime;

          mat2 get2dRotateMatrix(float _angle) {
            return mat2(cos(_angle), - sin(_angle),
                        sin(_angle), cos(_angle));
          }
          
        `
      );
      // begin_vertex is responsible for positioning the vertices
      // ... it copies (position) attribute into (transformed) vec3 variable
      material.vertexShader = material.vertexShader.replace(
        '#include <begin_vertex>',
        `
          #include <begin_vertex>
          
          // float angle = (position.y + 4.0) * sin(uTime) * 0.9;
          float angle = sin(position.y + uTime) * 1.5;

          mat2 rotateMatrix = get2dRotateMatrix(angle);

          transformed.xz = transformed.xz * rotateMatrix;
        `
      );
    };
  }
}

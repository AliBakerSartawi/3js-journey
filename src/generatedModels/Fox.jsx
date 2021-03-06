/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import React, { useRef } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'

export default function Model(props) {
  const group = useRef()
  const { nodes, materials, animations } = useGLTF('fox/Fox.gltf')
  const { actions } = useAnimations(animations, group)

  /**
   * useful link for animation actions (AnimationAction) ⬇️
   * https://drei.pmnd.rs/?path=/story/abstractions-useanimations--use-animations-st
   */
  function animateFox(type) {
    /**
     * Actions: Walk, Run, Survey
     * Check https://threejs.org/docs/index.html#api/en/animation/AnimationAction for better method structure than setTimeouts
     * 
     * Accessing the animation ⬇️
     * actions.Run || actions.Walk
     * actions[type] && provide parameter in the function call => animateFox('Walk')
     */
    // actions[type].play()
    actions[type].play().fadeIn(1)
    setTimeout(() => {
      // actions[type].reset()
      actions[type].fadeOut(1) // works
      setTimeout(() => {
        actions[type].stop() // works
      }, 1000);
    }, 5000);
  }
  return (
    <group ref={group} {...props} dispose={null} onClick={() => animateFox('Walk')}>
      <group scale={[0.025, 0.025, 0.025]}>
        <primitive object={nodes._rootJoint} />
        <skinnedMesh castShadow geometry={nodes.fox.geometry} material={materials.fox_material} skeleton={nodes.fox.skeleton} />
      </group>
    </group>
  )
}

useGLTF.preload('fox/Fox.gltf')

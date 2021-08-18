import React, { forwardRef, useMemo } from 'react'
import { Uniform } from 'three'
import { Effect } from 'postprocessing'

const fragmentShader = `
  uniform float red;
  void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    outputColor = vec4(red, 0.0, 0.0, 1.0);
  }
`

let _uRed

// Effect implementation
class TintCustomEffectImpl extends Effect {
  constructor({ red = 0.5 } = {}) {
    super('TintCustomEffect', fragmentShader, {
      uniforms: new Map([
        ['red', new Uniform(red)]
      ]),
    })

    _uRed = red
  }

  update(renderer, inputBuffer, deltaTime) {
    this.uniforms.get('red').value = _uRed
  }
}

// Effect component
export const TintCustomEffect = forwardRef(({ red }, ref) => {
  const effect = useMemo(() => new TintCustomEffectImpl(red), [red])
  return <primitive ref={ref} object={effect} dispose={null} />
})
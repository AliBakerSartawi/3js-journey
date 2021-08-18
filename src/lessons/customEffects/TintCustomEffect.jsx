import React, { forwardRef, useMemo } from 'react'
import { Uniform } from 'three'
import { Effect } from 'postprocessing'

const fragmentShader = `
  uniform float red;
  uniform float alpha;
  void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    outputColor = vec4(red, 0.0, 0.0, alpha);
  }
`

let _uRed
let _uAlpha

// Effect implementation
class TintCustomEffectImpl extends Effect {
  constructor({ red = 0.1, alpha = 0.1 } = {}) {
    super('TintCustomEffect', fragmentShader, {
      uniforms: new Map([
        ['red', new Uniform(red)],
        ['alpha', new Uniform(alpha)],
      ]),
    })

    _uRed = red
    _uAlpha = alpha
  }

  update(renderer, inputBuffer, deltaTime) {
    this.uniforms.get('red').value = _uRed
    this.uniforms.get('alpha').value = _uAlpha
  }
}

// Effect component
export const TintCustomEffect = forwardRef(({ red, alpha }, ref) => {
  const effect = useMemo(() => new TintCustomEffectImpl(red, alpha), [red, alpha])
  return <primitive ref={ref} object={effect} dispose={null} />
})
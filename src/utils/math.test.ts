import { describe, expect, it } from 'vitest'
import { clamp, damp, easeInOutCubic, invLerp, lerp, mapRange } from './math'

describe('math utilities', () => {
  it('clamps values into range', () => {
    expect(clamp(1.5)).toBe(1)
    expect(clamp(-2)).toBe(0)
    expect(clamp(5, 0, 10)).toBe(5)
  })

  it('interpolates linearly and inversely', () => {
    expect(lerp(0, 10, 0.25)).toBe(2.5)
    expect(invLerp(0, 10, 2.5)).toBe(0.25)
    expect(invLerp(3, 3, 3)).toBe(0)
  })

  it('maps and clamps between ranges', () => {
    expect(mapRange(50, 0, 100, 0, 1)).toBe(0.5)
    expect(mapRange(200, 0, 100, 0, 1)).toBe(1)
  })

  it('damps towards the target independently of frame rate', () => {
    const oneStep = damp(0, 1, 4, 1 / 30)
    const twoSteps = damp(damp(0, 1, 4, 1 / 60), 1, 4, 1 / 60)
    expect(oneStep).toBeCloseTo(twoSteps, 10)
    expect(damp(0, 1, 4, 100)).toBeCloseTo(1)
  })

  it('eases symmetrically with fixed endpoints', () => {
    expect(easeInOutCubic(0)).toBe(0)
    expect(easeInOutCubic(1)).toBe(1)
    expect(easeInOutCubic(0.5)).toBe(0.5)
    expect(easeInOutCubic(0.25) + easeInOutCubic(0.75)).toBeCloseTo(1)
  })
})

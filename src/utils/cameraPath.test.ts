import { describe, expect, it } from 'vitest'
import { lerpShot, sampleShots, type Shot } from './cameraPath'

const a: Shot = { position: [0, 0, 0], target: [0, 0, 0], fov: 20 }
const b: Shot = { position: [10, 0, 0], target: [0, 10, 0], fov: 40 }
const c: Shot = { position: [10, 10, 0], target: [0, 0, 10], fov: 30 }

describe('camera path', () => {
  it('interpolates every component of a shot', () => {
    const mid = lerpShot(a, b, 0.5)
    expect(mid.position).toEqual([5, 0, 0])
    expect(mid.target).toEqual([0, 5, 0])
    expect(mid.fov).toBe(30)
  })

  it('returns exact compositions at segment boundaries', () => {
    expect(sampleShots([a, b, c], 0)).toEqual(a)
    expect(sampleShots([a, b, c], 0.5)).toEqual(b)
    expect(sampleShots([a, b, c], 1)).toEqual(c)
  })

  it('clamps progress outside 0..1', () => {
    expect(sampleShots([a, b], -1)).toEqual(a)
    expect(sampleShots([a, b], 2)).toEqual(b)
  })

  it('handles single shot and rejects empty input', () => {
    expect(sampleShots([a], 0.7)).toBe(a)
    expect(() => sampleShots([], 0)).toThrow()
  })
})

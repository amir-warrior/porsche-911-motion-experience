import { clamp, easeInOutCubic, lerp } from './math'

export type Vec3 = readonly [number, number, number]

/** A composed camera framing: where the lens sits, what it looks at, and its focal width. */
export interface Shot {
  readonly position: Vec3
  readonly target: Vec3
  readonly fov: number
}

const lerpVec3 = (a: Vec3, b: Vec3, t: number): Vec3 => [
  lerp(a[0], b[0], t),
  lerp(a[1], b[1], t),
  lerp(a[2], b[2], t),
]

export const lerpShot = (a: Shot, b: Shot, t: number): Shot => ({
  position: lerpVec3(a.position, b.position, t),
  target: lerpVec3(a.target, b.target, t),
  fov: lerp(a.fov, b.fov, t),
})

/**
 * Sample a sequence of shots at a normalized progress (0..1).
 * Each segment is eased so the camera "settles" on every composition.
 */
export const sampleShots = (shots: readonly Shot[], progress: number): Shot => {
  if (shots.length === 0) throw new Error('sampleShots requires at least one shot')
  const first = shots[0] as Shot
  if (shots.length === 1) return first

  const segments = shots.length - 1
  const scaled = clamp(progress) * segments
  const index = Math.min(Math.floor(scaled), segments - 1)
  const local = scaled - index
  return lerpShot(shots[index] as Shot, shots[index + 1] as Shot, easeInOutCubic(local))
}

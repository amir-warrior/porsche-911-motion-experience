export const clamp = (value: number, min = 0, max = 1): number =>
  Math.min(max, Math.max(min, value))

export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t

/** Inverse lerp: where `value` sits between a and b (unclamped). */
export const invLerp = (a: number, b: number, value: number): number =>
  a === b ? 0 : (value - a) / (b - a)

export const mapRange = (
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
): number => lerp(outMin, outMax, clamp(invLerp(inMin, inMax, value)))

/**
 * Frame-rate independent exponential smoothing.
 * `lambda` ≈ responsiveness (higher = snappier); dt in seconds.
 */
export const damp = (current: number, target: number, lambda: number, dt: number): number =>
  lerp(current, target, 1 - Math.exp(-lambda * dt))

export const easeInOutCubic = (t: number): number =>
  t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2

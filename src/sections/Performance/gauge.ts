/** Geometry helpers for the speedometer arc (pure, unit-tested). */
export const GAUGE = { cx: 200, cy: 200, r: 160, startDeg: 135, sweepDeg: 270, max: 340 } as const

export const polar = (deg: number, radius: number = GAUGE.r): readonly [number, number] => {
  const rad = (deg * Math.PI) / 180
  return [GAUGE.cx + radius * Math.cos(rad), GAUGE.cy + radius * Math.sin(rad)]
}

export const valueToDeg = (value: number): number =>
  GAUGE.startDeg + (Math.min(Math.max(value, 0), GAUGE.max) / GAUGE.max) * GAUGE.sweepDeg

/** SVG arc path from 0 to `value` on the gauge. */
export const arcPath = (value: number, radius: number = GAUGE.r): string => {
  const [x0, y0] = polar(GAUGE.startDeg, radius)
  const endDeg = valueToDeg(value)
  const [x1, y1] = polar(endDeg, radius)
  const large = endDeg - GAUGE.startDeg > 180 ? 1 : 0
  return 'M' + x0.toFixed(2) + ' ' + y0.toFixed(2) + ' A' + radius + ' ' + radius + ' 0 ' + large + ' 1 ' + x1.toFixed(2) + ' ' + y1.toFixed(2)
}

export const tickValues = (step = 20): number[] =>
  Array.from({ length: Math.floor(GAUGE.max / step) + 1 }, (_, i) => i * step)

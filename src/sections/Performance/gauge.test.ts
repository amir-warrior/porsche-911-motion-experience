import { describe, expect, it } from 'vitest'
import { arcPath, GAUGE, polar, tickValues, valueToDeg } from './gauge'

describe('gauge geometry', () => {
  it('maps values onto the 270 degree sweep and clamps', () => {
    expect(valueToDeg(0)).toBe(135)
    expect(valueToDeg(GAUGE.max)).toBe(405)
    expect(valueToDeg(9999)).toBe(405)
    expect(valueToDeg(-5)).toBe(135)
  })

  it('places points on the circle', () => {
    const [x, y] = polar(0)
    expect(x).toBeCloseTo(360)
    expect(y).toBeCloseTo(200)
  })

  it('switches to the large-arc flag past 180 degrees', () => {
    expect(arcPath(100)).toContain(' 0 0 1 ')
    expect(arcPath(322)).toContain(' 0 1 1 ')
  })

  it('generates evenly spaced ticks', () => {
    expect(tickValues(20)).toHaveLength(18)
    expect(tickValues(20).at(-1)).toBe(340)
  })
})

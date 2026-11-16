import { describe, expect, it } from 'vitest'
import { formatNumber, kmhToMph, nmToLbFt, psToHp } from './units'

describe('unit conversions', () => {
  it('converts PS to mechanical hp', () => {
    expect(psToHp(711)).toBe(701)
  })

  it('converts Nm to lb-ft', () => {
    expect(nmToLbFt(800)).toBe(590)
  })

  it('converts km/h to mph', () => {
    expect(kmhToMph(322)).toBe(200)
    expect(kmhToMph(100)).toBe(62)
  })

  it('formats numbers with thin-space grouping', () => {
    expect(formatNumber(2300)).toBe('2 300')
    expect(formatNumber(2.5, 1)).toBe('2.5')
    expect(formatNumber(711)).toBe('711')
  })
})

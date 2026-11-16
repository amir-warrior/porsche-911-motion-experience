import { describe, expect, it } from 'vitest'
import { readDeviceSignals, supportsWebGL } from './device'

describe('device signals', () => {
  it('reads browser hints without throwing', () => {
    const signals = readDeviceSignals()
    expect(signals.viewportWidth).toBeGreaterThan(0)
    expect(typeof signals.coarsePointer).toBe('boolean')
  })

  it('reports no WebGL in jsdom', () => {
    expect(supportsWebGL()).toBe(false)
  })
})

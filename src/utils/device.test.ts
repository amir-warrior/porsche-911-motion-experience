import { describe, expect, it } from 'vitest'
import { classifyDevice } from './device'

const desktop = { coarsePointer: false, cores: 12, memoryGb: 16, viewportWidth: 1600 }

describe('classifyDevice', () => {
  it('treats capable desktops as high tier', () => {
    expect(classifyDevice(desktop)).toBe('high')
    expect(classifyDevice({ ...desktop, memoryGb: undefined })).toBe('high')
  })

  it('downgrades low memory or few cores', () => {
    expect(classifyDevice({ ...desktop, memoryGb: 4 })).toBe('low')
    expect(classifyDevice({ ...desktop, cores: 4 })).toBe('low')
  })

  it('downgrades touch devices with small viewports', () => {
    expect(classifyDevice({ ...desktop, coarsePointer: true, viewportWidth: 390 })).toBe('low')
    expect(classifyDevice({ ...desktop, coarsePointer: true, viewportWidth: 1366 })).toBe('high')
  })
})

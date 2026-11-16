import { describe, expect, it } from 'vitest'
import { Color, MeshStandardMaterial } from 'three'
import { PAINTS, WHEEL_FINISHES } from '../../data/paints'
import { applyPaint, applyWheelFinish, classifyPart, createGlassMaterial, createPaintMaterial } from './carMaterials'

describe('classifyPart', () => {
  it('maps the role names baked into the optimized GLB', () => {
    expect(classifyPart('paint')).toBe('paint')
    expect(classifyPart('wheel_rim')).toBe('wheel_rim')
    expect(classifyPart('glass')).toBe('glass')
    expect(classifyPart('headlight')).toBe('headlight')
    expect(classifyPart('chrome')).toBe('other')
    expect(classifyPart('')).toBe('other')
  })
})

describe('materials', () => {
  it('creates clearcoat paint and applies paint options', () => {
    const mat = createPaintMaterial()
    const target = new Color()
    const red = PAINTS.find((p) => p.id === 'guards-red')!
    applyPaint(mat, red, target)
    expect(mat.clearcoat).toBe(1)
    expect(mat.roughness).toBe(red.roughness)
    expect(target.r).toBeGreaterThan(target.g)
  })

  it('creates dark reflective glass', () => {
    const glass = createGlassMaterial()
    expect(glass.roughness).toBeLessThan(0.1)
    expect(glass.color.r).toBeLessThan(0.01)
  })

  it('applies wheel finishes', () => {
    const mat = new MeshStandardMaterial()
    applyWheelFinish(mat, WHEEL_FINISHES[2]!)
    expect(mat.metalness).toBe(1)
  })
})

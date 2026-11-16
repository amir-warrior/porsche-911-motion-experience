import { describe, expect, it } from 'vitest'
import { Color, MeshStandardMaterial } from 'three'
import { PAINTS, WHEEL_FINISHES } from '../../data/paints'
import { applyPaint, applyWheelFinish, classifyPart, createPaintMaterial } from './carMaterials'

describe('classifyPart', () => {
  it('detects common glTF naming conventions', () => {
    expect(classifyPart('Object_12', 'CarPaint')).toBe('paint')
    expect(classifyPart('body_main', 'mat01')).toBe('paint')
    expect(classifyPart('FrontWindow', 'mat')).toBe('glass')
    expect(classifyPart('wheel_FL', 'rim_mat')).toBe('wheel')
    expect(classifyPart('seat', 'leather')).toBe('other')
  })
})

describe('materials', () => {
  it('creates a clearcoat paint and applies paint options', () => {
    const mat = createPaintMaterial(new MeshStandardMaterial())
    const target = new Color()
    const red = PAINTS.find((p) => p.id === 'guards-red')!
    applyPaint(mat, red, target)
    expect(mat.clearcoat).toBe(1)
    expect(mat.roughness).toBe(red.roughness)
    expect(target.r).toBeGreaterThan(target.g)
  })

  it('applies wheel finishes', () => {
    const mat = new MeshStandardMaterial()
    applyWheelFinish(mat, WHEEL_FINISHES[2]!)
    expect(mat.metalness).toBe(1)
  })
})

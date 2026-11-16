import { Color, MeshPhysicalMaterial, type MeshStandardMaterial } from 'three'
import type { PaintOption, WheelFinish } from '../../data/paints'

/**
 * Material roles baked into the optimized GLB by scripts/optimize-model.mjs.
 * The runtime keys behaviour off these names.
 */
export type PartRole =
  | 'paint'
  | 'glass'
  | 'tyre'
  | 'wheel_rim'
  | 'headlight'
  | 'taillight'
  | 'other'

const KNOWN_ROLES: readonly PartRole[] = ['paint', 'glass', 'tyre', 'wheel_rim', 'headlight', 'taillight']

export const classifyPart = (materialName: string): PartRole =>
  (KNOWN_ROLES as readonly string[]).includes(materialName) ? (materialName as PartRole) : 'other'

/** Clearcoat automotive paint built on the physically based material. */
export const createPaintMaterial = (): MeshPhysicalMaterial => {
  const mat = new MeshPhysicalMaterial({ clearcoat: 1, clearcoatRoughness: 0.03, envMapIntensity: 1.25 })
  mat.name = 'paint'
  return mat
}

/** Dark tinted glass: almost black base, mirror-like coat so it picks up the studio lights. */
export const createGlassMaterial = (): MeshPhysicalMaterial => {
  const mat = new MeshPhysicalMaterial({
    color: new Color(0.004, 0.005, 0.006),
    metalness: 0,
    roughness: 0.05,
    clearcoat: 1,
    clearcoatRoughness: 0,
    envMapIntensity: 1.6,
  })
  mat.name = 'glass'
  return mat
}

export const EMISSIVE_INTENSITY: Partial<Record<PartRole, number>> = { headlight: 2.4, taillight: 1.8 }

export const applyPaint = (mat: MeshPhysicalMaterial, paint: PaintOption, colorTarget: Color): void => {
  colorTarget.set(paint.color).convertSRGBToLinear()
  mat.metalness = paint.metalness
  mat.roughness = paint.roughness
  mat.clearcoatRoughness = paint.clearcoatRoughness
}

export const applyWheelFinish = (mat: MeshStandardMaterial, wheel: WheelFinish): void => {
  mat.color = new Color(wheel.color).convertSRGBToLinear()
  mat.metalness = wheel.metalness
  mat.roughness = wheel.roughness
  mat.needsUpdate = true
}

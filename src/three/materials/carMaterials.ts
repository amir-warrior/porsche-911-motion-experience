import { Color, MeshPhysicalMaterial, type Material, type MeshStandardMaterial } from 'three'
import type { PaintOption, WheelFinish } from '../../data/paints'

export type PartKind = 'paint' | 'wheel' | 'glass' | 'other'

const PART_PATTERNS: readonly (readonly [PartKind, RegExp])[] = [
  ['glass', /glass|window|windshield|windscreen/i],
  ['wheel', /rim|wheel(?!.*arch)|alloy/i],
  ['paint', /paint|body|carpaint|car_paint|exterior/i],
]

/** Classify a mesh by its mesh and material names. */
export const classifyPart = (meshName: string, materialName: string): PartKind => {
  const name = meshName + ' ' + materialName
  for (const [kind, pattern] of PART_PATTERNS) if (pattern.test(name)) return kind
  return 'other'
}

/** Clearcoat automotive paint built on the physically based material. */
export const createPaintMaterial = (source?: Material): MeshPhysicalMaterial => {
  const mat = new MeshPhysicalMaterial({
    clearcoat: 1,
    clearcoatRoughness: 0.03,
    envMapIntensity: 1.25,
  })
  const std = source as MeshStandardMaterial | undefined
  if (std?.normalMap) mat.normalMap = std.normalMap
  if (std?.aoMap) mat.aoMap = std.aoMap
  mat.name = 'paint'
  return mat
}

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

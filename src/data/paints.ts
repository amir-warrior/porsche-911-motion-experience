/**
 * Visual paint concepts for the configurator. Hex values are artistic approximations
 * rendered with a clearcoat physical material — not official factory colour data.
 */
export interface PaintOption {
  readonly id: string
  readonly name: string
  readonly color: string
  readonly metalness: number
  readonly roughness: number
  readonly clearcoatRoughness: number
}

export const PAINTS: readonly PaintOption[] = [
  { id: 'gt-silver', name: 'GT Silver', color: '#a9abad', metalness: 0.85, roughness: 0.32, clearcoatRoughness: 0.03 },
  { id: 'jet-black', name: 'Jet Black', color: '#0b0c0e', metalness: 0.6, roughness: 0.28, clearcoatRoughness: 0.02 },
  { id: 'guards-red', name: 'Guards Red', color: '#b0081a', metalness: 0.1, roughness: 0.38, clearcoatRoughness: 0.03 },
  { id: 'arctic-grey', name: 'Arctic Grey', color: '#8d9497', metalness: 0.05, roughness: 0.42, clearcoatRoughness: 0.04 },
  { id: 'gentian-blue', name: 'Gentian Blue', color: '#16264a', metalness: 0.75, roughness: 0.3, clearcoatRoughness: 0.03 },
  { id: 'carrara-white', name: 'Carrara White', color: '#e9e8e3', metalness: 0.4, roughness: 0.35, clearcoatRoughness: 0.03 },
]

export interface WheelFinish {
  readonly id: string
  readonly name: string
  readonly color: string
  readonly metalness: number
  readonly roughness: number
}

export const WHEEL_FINISHES: readonly WheelFinish[] = [
  { id: 'turbonite', name: 'Turbonite', color: '#3d3c39', metalness: 0.9, roughness: 0.35 },
  { id: 'satin-black', name: 'Satin Black', color: '#121212', metalness: 0.4, roughness: 0.55 },
  { id: 'brushed-silver', name: 'Brushed Silver', color: '#b7b9bb', metalness: 1, roughness: 0.28 },
]

export const DEFAULT_PAINT_ID = 'carrara-white'
export const DEFAULT_WHEEL_ID = 'turbonite'

const firstOf = <T,>(items: readonly T[]): T => {
  const item = items[0]
  if (item === undefined) throw new Error('Option list must not be empty')
  return item
}

export const findPaint = (id: string): PaintOption => PAINTS.find((p) => p.id === id) ?? firstOf(PAINTS)

export const findWheel = (id: string): WheelFinish =>
  WHEEL_FINISHES.find((w) => w.id === id) ?? firstOf(WHEEL_FINISHES)

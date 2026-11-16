export type EnvironmentId = 'studio' | 'night' | 'sunset'

export interface LightformerSpec {
  readonly form: 'rect' | 'circle' | 'ring'
  readonly color: string
  readonly intensity: number
  readonly position: readonly [number, number, number]
  readonly scale: readonly [number, number, number]
  readonly rotation?: readonly [number, number, number]
}

/**
 * Physically lit moods. Each preset drives the real renderer:
 * the procedural environment map (reflections), key/rim lights, fog and exposure.
 */
export interface EnvironmentPreset {
  readonly id: EnvironmentId
  readonly label: string
  readonly description: string
  readonly background: string
  readonly fog: { readonly color: string; readonly near: number; readonly far: number }
  readonly exposure: number
  readonly key: {
    readonly color: string
    readonly intensity: number
    readonly position: readonly [number, number, number]
  }
  readonly rim: { readonly color: string; readonly intensity: number }
  readonly floor: string
  readonly lightformers: readonly LightformerSpec[]
}

const HALF_PI = Math.PI / 2

export const ENVIRONMENTS: Record<EnvironmentId, EnvironmentPreset> = {
  studio: {
    id: 'studio',
    label: 'Studio',
    description: 'Controlled softboxes. Neutral, precise, every surface readable.',
    background: '#0b0b0b',
    fog: { color: '#0b0b0b', near: 9, far: 24 },
    exposure: 1.0,
    key: { color: '#ffffff', intensity: 2.2, position: [4, 7, 3] },
    rim: { color: '#dfe6ff', intensity: 1.2 },
    floor: '#0d0d0d',
    lightformers: [
      { form: 'rect', color: '#ffffff', intensity: 3, position: [0, 5, 0], scale: [10, 1.4, 1], rotation: [HALF_PI, 0, 0] },
      { form: 'rect', color: '#ffffff', intensity: 1.6, position: [-6, 1.5, 0], scale: [8, 1.2, 1], rotation: [0, HALF_PI, 0] },
      { form: 'rect', color: '#ffffff', intensity: 1.6, position: [6, 1.5, 0], scale: [8, 1.2, 1], rotation: [0, -HALF_PI, 0] },
      { form: 'rect', color: '#ffffff', intensity: 0.8, position: [0, 1.5, 7], scale: [6, 2, 1] },
    ],
  },
  night: {
    id: 'night',
    label: 'Night',
    description: 'Darkness with thin strip highlights tracing the silhouette.',
    background: '#030305',
    fog: { color: '#030305', near: 7, far: 18 },
    exposure: 0.85,
    key: { color: '#9fb4ff', intensity: 0.6, position: [-3, 6, -4] },
    rim: { color: '#ff2a3d', intensity: 2.4 },
    floor: '#050507',
    lightformers: [
      { form: 'rect', color: '#a8c0ff', intensity: 4, position: [0, 4, -2], scale: [12, 0.12, 1], rotation: [HALF_PI, 0, 0] },
      { form: 'rect', color: '#a8c0ff', intensity: 3, position: [-5, 1.2, 0], scale: [10, 0.1, 1], rotation: [0, HALF_PI, 0] },
      { form: 'rect', color: '#ff3347', intensity: 2.5, position: [0, 0.8, -6], scale: [6, 0.1, 1] },
      { form: 'ring', color: '#ffffff', intensity: 1.2, position: [4, 3, 4], scale: [1.5, 1.5, 1.5] },
    ],
  },
  sunset: {
    id: 'sunset',
    label: 'Sunset',
    description: 'Low warm sun, violet sky fill and long amber reflections.',
    background: '#140b0a',
    fog: { color: '#1d0f0c', near: 8, far: 22 },
    exposure: 1.05,
    key: { color: '#ff9a52', intensity: 3.2, position: [-7, 1.6, 4] },
    rim: { color: '#8f6bff', intensity: 1.1 },
    floor: '#120b09',
    lightformers: [
      { form: 'rect', color: '#ff8a3d', intensity: 6, position: [-8, 1.2, 3], scale: [10, 2.2, 1], rotation: [0, 1.2, 0] },
      { form: 'rect', color: '#6a4cff', intensity: 1.3, position: [0, 6, 0], scale: [14, 14, 1], rotation: [HALF_PI, 0, 0] },
      { form: 'circle', color: '#ffd29a', intensity: 8, position: [-9, 1.4, 5], scale: [1.6, 1.6, 1] },
      { form: 'rect', color: '#ff6a3d', intensity: 1.2, position: [6, 0.6, -2], scale: [8, 0.6, 1], rotation: [0, -HALF_PI, 0] },
    ],
  },
}

export const ENVIRONMENT_ORDER: readonly EnvironmentId[] = ['studio', 'night', 'sunset']

export const isEnvironmentId = (value: unknown): value is EnvironmentId =>
  typeof value === 'string' && value in ENVIRONMENTS

import type { Shot } from '../utils/cameraPath'

/**
 * Camera compositions in model space. The model is normalized at load time:
 * length 3.05 units along Z (see modelConfig) (nose towards +Z), wheels resting on y = 0.
 */
export const SHOTS = {
  intro: { position: [9.5, 2.6, 11], target: [0, 0.6, 0], fov: 26 },
  hero: { position: [3.6, 0.8, 5.5], target: [-0.6, -0.22, 0.3], fov: 30 },
  front: { position: [0.001, 0.72, 6.4], target: [0, 0.58, 0], fov: 27 },
  profile: { position: [7.8, 0.75, 0.2], target: [0, 0.6, 0.2], fov: 26 },
  rear: { position: [-3.6, 1.15, -5.6], target: [0, 0.68, -0.2], fov: 28 },
  wheel: { position: [2.9, 0.42, 2.9], target: [0.85, 0.36, 1.3], fov: 22 },
  plan: { position: [0.001, 12.5, 0.8], target: [0, 0, 0], fov: 28 },
  // Car framed right of the copy column.
  design: { position: [5.6, 1.9, 6.0], target: [-0.8, 0.3, 0.75], fov: 30 },
  // Car framed left of the configurator panel.
  studio: { position: [6.4, 1.9, 7.0], target: [0.8, 0.35, -0.76], fov: 30 },
  finale: { position: [-7.2, 0.55, 5.4], target: [0, 0.75, 0], fov: 28 },
  // Stand-alone photo compositions for the gallery (car fills the frame).
  photoFront: { position: [2.9, 0.75, 3.1], target: [0, 0.38, 0.1], fov: 30 },
  photoHigh: { position: [3.2, 1.6, 2.9], target: [0, 0.3, 0], fov: 30 },
  photoLow: { position: [-2.9, 0.35, 3.0], target: [0, 0.5, 0], fov: 30 },
  photoProfile: { position: [3.6, 0.55, 0.05], target: [0, 0.42, 0.05], fov: 30 },
} as const satisfies Record<string, Shot>

export type ShotId = keyof typeof SHOTS

/** Ordered compositions for the pinned scroll journey. */
export const JOURNEY_SHOTS: readonly Shot[] = [
  SHOTS.hero,
  SHOTS.front,
  SHOTS.profile,
  SHOTS.rear,
  SHOTS.wheel,
  SHOTS.plan,
]

export interface CameraPreset {
  readonly id: ShotId
  readonly label: string
}

export const STUDIO_PRESETS: readonly CameraPreset[] = [
  { id: 'studio', label: '3/4 Front' },
  { id: 'front', label: 'Front' },
  { id: 'profile', label: 'Profile' },
  { id: 'rear', label: 'Rear' },
  { id: 'plan', label: 'Plan' },
]

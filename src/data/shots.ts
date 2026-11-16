import type { Shot } from '../utils/cameraPath'

/**
 * Camera compositions in model space. The model is normalized at load time:
 * length ≈ 4.5 units along Z (nose towards +Z), wheels resting on y = 0.
 */
export const SHOTS = {
  intro: { position: [9.5, 2.6, 11], target: [0, 0.6, 0], fov: 26 },
  hero: { position: [4.6, 0.85, 5.4], target: [-0.2, 0.55, 0], fov: 30 },
  front: { position: [0.001, 0.72, 6.4], target: [0, 0.58, 0], fov: 27 },
  profile: { position: [7.8, 0.75, 0.2], target: [0, 0.6, 0.2], fov: 26 },
  rear: { position: [-3.6, 1.15, -5.6], target: [0, 0.68, -0.2], fov: 28 },
  wheel: { position: [2.9, 0.42, 2.9], target: [0.85, 0.36, 1.3], fov: 22 },
  plan: { position: [0.001, 9.5, 0.6], target: [0, 0, 0], fov: 28 },
  design: { position: [5.2, 1.5, 4.6], target: [0, 0.5, 0], fov: 32 },
  studio: { position: [5.4, 1.7, 5.6], target: [0, 0.5, 0], fov: 32 },
  finale: { position: [-5.8, 0.5, 4.2], target: [0, 0.6, 0], fov: 28 },
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

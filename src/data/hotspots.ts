import type { Shot, Vec3 } from '../utils/cameraPath'
import type { SourceKey } from './sources'

export interface Hotspot {
  readonly id: string
  readonly label: string
  readonly title: string
  readonly body: string
  /** Anchor in normalized model space. */
  readonly anchor: Vec3
  /** Camera composition used when the hotspot is focused. */
  readonly shot: Shot
  readonly source: SourceKey
}

/** Design and aerodynamic details — text paraphrased from the official press kit. */
export const HOTSPOTS: readonly Hotspot[] = [
  {
    id: 'front-spoiler',
    label: 'Adaptive front spoiler',
    title: 'Three-stage front lip',
    body: 'Fully retracted, partly extended or fully deployed depending on the drive mode: lower drag on the motorway, more downforce on track. It carries the "Turbo S" lettering.',
    anchor: [0, 0.2, 2.2],
    shot: { position: [1.6, 0.35, 4.6], target: [0, 0.25, 1.9], fov: 26 },
    source: 'aero',
  },
  {
    id: 'cooling-flaps',
    label: 'Active cooling-air flaps',
    title: 'Five vertical flaps',
    body: 'Nearly closed when demand is low, opened wide for high loads such as track driving. Each active element in its most efficient position cuts drag by up to 10 per cent.',
    anchor: [0.45, 0.32, 2.15],
    shot: { position: [2.2, 0.6, 4.2], target: [0.4, 0.35, 1.8], fov: 24 },
    source: 'aero',
  },
  {
    id: 'front-diffusers',
    label: 'Adaptive front diffusers',
    title: 'New for the Turbo S',
    body: 'They open and close with the cooling flaps. Open, they reduce front-axle lift and cool the brakes; in Wet mode they close to protect the front discs.',
    anchor: [0.66, 0.14, 1.88],
    shot: { position: [3, 0.25, 3.6], target: [0.6, 0.2, 1.5], fov: 24 },
    source: 'aero',
  },
  {
    id: 'headlights',
    label: 'Light signature',
    title: 'Four-point signature',
    body: 'Front lighting functions are integrated into the main headlight units, tinted as standard. The four-point signature is active in every light mode.',
    anchor: [0.55, 0.68, 1.72],
    shot: { position: [2.3, 0.95, 4.2], target: [0.5, 0.6, 1.7], fov: 22 },
    source: 'aero',
  },
  {
    id: 'rear-wing',
    label: 'Active rear wing',
    title: 'Lift down, drag down',
    body: 'The active rear wing reduces lift at high speed and minimises drag when set to its most efficient position. Its slats are finished in Turbonite.',
    anchor: [0, 0.98, -1.95],
    shot: { position: [-2.8, 2.1, -4.6], target: [0, 0.95, -1.6], fov: 26 },
    source: 'aero',
  },
  {
    id: 'haunches',
    label: 'Widened body',
    title: '+45 mm front, +20 mm rear',
    body: 'Front wheel arches are 45 mm wider than on the 911 Carrera models; the rear arches widen the body by a further 20 mm.',
    anchor: [0.98, 0.78, -1.15],
    shot: { position: [4.4, 1.1, -3.2], target: [0.6, 0.6, -1.1], fov: 26 },
    source: 'aero',
  },
]

export const findHotspot = (id: string | null): Hotspot | undefined =>
  id === null ? undefined : HOTSPOTS.find((h) => h.id === id)

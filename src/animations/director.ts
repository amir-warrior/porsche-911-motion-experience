import { SHOTS } from '../data/shots'
import type { Shot } from '../utils/cameraPath'

/**
 * The director holds per-frame camera intent written by ScrollTrigger callbacks
 * and read inside the render loop. It is intentionally a mutable singleton:
 * routing 60 fps scroll values through React state would re-render the tree
 * every frame. Only plain numbers live here — UI state stays in sceneStore.
 */
export interface Director {
  /** Composition requested by the scroll timeline. */
  scrollShot: Shot
  /** Pointer parallax, -1..1 on both axes. */
  pointer: { x: number; y: number }
  /** Camera damping responsiveness; raised to snap under reduced motion. */
  lambda: number
}

export const director: Director = {
  scrollShot: SHOTS.intro,
  pointer: { x: 0, y: 0 },
  lambda: 3.2,
}

export const setScrollShot = (shot: Shot): void => {
  director.scrollShot = shot
}

export const setPointer = (x: number, y: number): void => {
  director.pointer.x = x
  director.pointer.y = y
}

export const DAMPING = { cinematic: 3.2, reduced: 60 } as const

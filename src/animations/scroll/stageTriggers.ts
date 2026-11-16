import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { sceneActions } from '../../store/sceneStore'
import type { Shot } from '../../utils/cameraPath'
import { setScrollShot } from '../director'

type Cleanup = () => void

/**
 * Reference-counted "solid" sections: while any solid section fills the viewport
 * the 3D stage is hidden and its render loop paused.
 */
const activeSolids = new Set<Element>()

const syncStage = () => sceneActions.setStageVisible(activeSolids.size === 0)

export const createSolidTrigger = (section: Element): Cleanup => {
  const trigger = ScrollTrigger.create({
    trigger: section,
    start: 'top top',
    end: 'bottom bottom',
    onToggle: (self) => {
      if (self.isActive) activeSolids.add(section)
      else activeSolids.delete(section)
      syncStage()
    },
  })
  return () => {
    trigger.kill()
    activeSolids.delete(section)
    syncStage()
  }
}

interface ShotTriggerOptions {
  readonly shot: Shot
  readonly start?: string
  readonly end?: string
  readonly onToggle?: (active: boolean) => void
}

/** Request a camera composition while a section occupies the centre of the viewport. */
export const createShotTrigger = (section: Element, options: ShotTriggerOptions): Cleanup => {
  const trigger = ScrollTrigger.create({
    trigger: section,
    start: options.start ?? 'top center',
    end: options.end ?? 'bottom center',
    onToggle: (self) => {
      if (self.isActive) setScrollShot(options.shot)
      options.onToggle?.(self.isActive)
    },
  })
  return () => trigger.kill()
}

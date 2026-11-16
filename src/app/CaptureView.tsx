import { useEffect } from 'react'
import { director, setScrollShot } from '../animations/director'
import { isEnvironmentId } from '../data/environments'
import { SHOTS, type ShotId } from '../data/shots'
import { sceneActions, sceneStore } from '../store/sceneStore'
import { StageLayer } from '../three/scenes/StageLayer'

/** Frames rendered after the model is ready before the shot counts as settled. */
const SETTLE_FRAMES = 90
const SNAP_LAMBDA = 1000

declare global {
  interface Window {
    __CAPTURE_READY__?: boolean
  }
}

const isShotId = (value: string | null): value is ShotId => value !== null && value in SHOTS

/**
 * Deterministic render mode used by scripts/capture-renders.mjs:
 * /?capture=<shot>&env=<studio|night|sunset>&paint=<paint-id>
 * Shows only the stage, snaps the camera and flags window.__CAPTURE_READY__.
 */
export const CaptureView = ({ params }: { readonly params: URLSearchParams }) => {
  useEffect(() => {
    const shot = params.get('capture')
    const env = params.get('env')
    const paint = params.get('paint')
    if (isEnvironmentId(env)) sceneActions.setEnvironment(env)
    if (paint) sceneActions.setPaint(paint)
    director.lambda = SNAP_LAMBDA
    setScrollShot(isShotId(shot) ? SHOTS[shot] : SHOTS.hero)
    sceneActions.finishIntro()

    let frames = 0
    let raf = 0
    const tick = () => {
      if (sceneStore.getState().webgl === 'ready') frames += 1
      if (frames >= SETTLE_FRAMES) window.__CAPTURE_READY__ = true
      else raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [params])

  return <StageLayer minimal />
}

import { OrbitControls } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef, type ComponentRef } from 'react'
import { PerspectiveCamera, Vector3 } from 'three'
import { director } from '../../animations/director'
import { findHotspot } from '../../data/hotspots'
import { SHOTS } from '../../data/shots'
import { useSceneStore } from '../../hooks/useSceneStore'
import { sceneStore } from '../../store/sceneStore'
import type { Shot } from '../../utils/cameraPath'
import { damp } from '../../utils/math'

const PARALLAX = { x: 0.35, y: 0.18 } as const

/** Which composition the camera should settle on right now (story mode). */
const resolveShot = (): Shot => {
  const { activeHotspot, presetShot } = sceneStore.getState()
  const hotspot = findHotspot(activeHotspot)
  if (hotspot) return hotspot.shot
  if (presetShot) return SHOTS[presetShot]
  return director.scrollShot
}

/**
 * Story camera: damps position, look-at target and FOV towards the requested
 * composition every frame, with subtle pointer parallax. In explore mode it
 * hands control to OrbitControls, seeded from where the story camera stands.
 */
export const CameraRig = () => {
  const camera = useThree((s) => s.camera) as PerspectiveCamera
  const mode = useSceneStore((s) => s.mode)
  const lookAt = useMemo(() => new Vector3(...SHOTS.intro.target), [])
  const desired = useMemo(() => new Vector3(), [])
  const controls = useRef<ComponentRef<typeof OrbitControls>>(null)

  useFrame((_, rawDt) => {
    if (mode === 'explore') return
    const dt = Math.min(rawDt, 0.1)
    const shot = resolveShot()
    const lambda = director.lambda

    desired.set(
      shot.position[0] + director.pointer.x * PARALLAX.x,
      shot.position[1] + director.pointer.y * PARALLAX.y,
      shot.position[2],
    )
    camera.position.set(
      damp(camera.position.x, desired.x, lambda, dt),
      damp(camera.position.y, desired.y, lambda, dt),
      damp(camera.position.z, desired.z, lambda, dt),
    )
    lookAt.set(
      damp(lookAt.x, shot.target[0], lambda, dt),
      damp(lookAt.y, shot.target[1], lambda, dt),
      damp(lookAt.z, shot.target[2], lambda, dt),
    )
    const fov = damp(camera.fov, shot.fov, lambda, dt)
    if (Math.abs(fov - camera.fov) > 1e-4) {
      camera.fov = fov
      camera.updateProjectionMatrix()
    }
    camera.lookAt(lookAt)
  })

  // Seed orbit target from the story camera when the visitor takes control.
  useEffect(() => {
    if (mode === 'explore' && controls.current) {
      controls.current.target.copy(lookAt)
      controls.current.update()
    }
  }, [mode, lookAt])

  if (mode !== 'explore') return null

  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enablePan={false}
      enableDamping
      dampingFactor={0.08}
      rotateSpeed={0.6}
      zoomSpeed={0.7}
      minDistance={3.4}
      maxDistance={11}
      minPolarAngle={0.2}
      maxPolarAngle={Math.PI / 2 - 0.04}
      onChange={() => {
        if (controls.current) lookAt.copy(controls.current.target)
      }}
    />
  )
}

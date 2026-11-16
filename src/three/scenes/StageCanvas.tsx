import { PerformanceMonitor } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Suspense, useEffect, useState } from 'react'
import { ACESFilmicToneMapping, SRGBColorSpace } from 'three'
import { SHOTS } from '../../data/shots'
import { useSceneStore } from '../../hooks/useSceneStore'
import { loadingActions } from '../../store/loadingStore'
import { sceneActions } from '../../store/sceneStore'
import type { DeviceTier } from '../../utils/device'
import { CameraRig } from '../controls/CameraRig'
import { Hotspots } from '../hotspots/Hotspots'
import { SceneLighting } from '../lighting/SceneLighting'
import { Porsche911 } from '../models/Porsche911'
import { CaptureBridge, ProgressBridge } from './Bridges'
import { Ground } from './Ground'

const DPR_RANGE: Record<DeviceTier, readonly [number, number]> = {
  high: [1, 2],
  low: [1, 1.5],
}

/** Signals the preloader once the model has mounted and rendered a frame. */
const ReadySignal = () => {
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      loadingActions.complete()
      sceneActions.setWebGL('ready')
    })
    return () => cancelAnimationFrame(id)
  }, [])
  return null
}

export interface StageCanvasProps {
  readonly tier: DeviceTier
  /** Render mode for still captures: fixed DPR, no adaptive downgrades. */
  readonly capture?: boolean
}

/** The single persistent WebGL stage shared by every section. */
const StageCanvas = ({ tier, capture = false }: StageCanvasProps) => {
  const stageVisible = useSceneStore((s) => s.stageVisible)
  const mode = useSceneStore((s) => s.mode)
  const [min, max] = DPR_RANGE[tier]
  const [dpr, setDpr] = useState(max)
  const shadows = tier === 'high'

  useEffect(() => loadingActions.chunkLoaded(), [])

  return (
    <Canvas
      dpr={dpr}
      shadows={shadows}
      frameloop={stageVisible || mode === 'explore' ? 'always' : 'never'}
      camera={{ position: [...SHOTS.intro.position], fov: SHOTS.intro.fov, near: 0.1, far: 60 }}
      gl={{ antialias: true, powerPreference: 'high-performance', alpha: true, stencil: false }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0)
        gl.toneMapping = ACESFilmicToneMapping
        gl.outputColorSpace = SRGBColorSpace
        gl.toneMappingExposure = 1
      }}
      aria-hidden="true"
    >
      {capture ? null : (
        <PerformanceMonitor
          onDecline={() => setDpr((d) => Math.max(min, d - 0.5))}
          onIncline={() => setDpr((d) => Math.min(max, d + 0.25))}
          flipflops={3}
          onFallback={() => setDpr(min)}
        />
      )}
      <ProgressBridge />
      <SceneLighting shadows={shadows} envResolution={tier === 'high' ? 512 : 256} />
      <Suspense fallback={null}>
        <Porsche911 shadows={shadows} />
        <ReadySignal />
      </Suspense>
      <Ground receiveShadow={shadows} />
      <Hotspots />
      <CameraRig />
      <CaptureBridge />
    </Canvas>
  )
}

export default StageCanvas

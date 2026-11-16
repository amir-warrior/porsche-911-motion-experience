import { lazy, Suspense, useEffect, useState } from 'react'
import { ENVIRONMENTS } from '../../data/environments'
import { useSceneStore } from '../../hooks/useSceneStore'
import { loadingActions } from '../../store/loadingStore'
import { sceneActions } from '../../store/sceneStore'
import { classifyDevice, readDeviceSignals, supportsWebGL, type DeviceTier } from '../../utils/device'
import { ErrorBoundary } from '../../components/UI/ErrorBoundary'
import { StageFallback } from './StageFallback'

const StageCanvas = lazy(() => import('./StageCanvas'))

const failStage = () => {
  sceneActions.setWebGL('failed')
  loadingActions.complete()
}

/**
 * Fixed full-viewport stage behind the content, in three planes:
 * backdrop colour (per lighting mood) → giant numeral → transparent WebGL canvas.
 * The car therefore sits in front of the typography. three.js loads lazily;
 * the layer fades out while solid sections cover the screen and only accepts
 * pointer input while the visitor explores.
 */
export const StageLayer = () => {
  const [tier] = useState<DeviceTier>(() => classifyDevice(readDeviceSignals()))
  const [webglOk] = useState(() => supportsWebGL())
  const webgl = useSceneStore((s) => s.webgl)
  const visible = useSceneStore((s) => s.stageVisible)
  const exploring = useSceneStore((s) => s.mode === 'explore')
  const environment = useSceneStore((s) => s.environment)

  useEffect(() => {
    if (!webglOk) {
      sceneActions.setWebGL('unsupported')
      loadingActions.complete()
    }
  }, [webglOk])

  const showFallback = !webglOk || webgl === 'failed'

  return (
    <div
      id="stage"
      className={[
        'fixed inset-0 z-0 transition-opacity duration-700',
        visible || exploring ? 'opacity-100' : 'opacity-0',
        exploring ? 'pointer-events-auto touch-none cursor-grab active:cursor-grabbing' : 'pointer-events-none',
      ].join(' ')}
    >
      <div
        className="absolute inset-0 transition-colors duration-[1600ms]"
        style={{ backgroundColor: ENVIRONMENTS[environment].background }}
      />
      <div
        data-stage-numeral
        aria-hidden="true"
        className="type-display pointer-events-none absolute inset-x-0 top-[14svh] select-none text-center text-[42vw] leading-none text-transparent [-webkit-text-stroke:1px_rgba(245,245,243,0.14)] md:top-[6svh] md:text-[36vw]"
      >
        911
      </div>
      {showFallback ? (
        <StageFallback />
      ) : (
        <ErrorBoundary fallback={<StageFallback />} onError={failStage}>
          <Suspense fallback={null}>
            <StageCanvas tier={tier} />
          </Suspense>
        </ErrorBoundary>
      )}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(7,7,7,0.7)_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink/80 to-transparent" />
    </div>
  )
}

import { useProgress } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { useEffect } from 'react'
import { loadingActions } from '../../store/loadingStore'
import { registerCapture } from '../capture/photoMode'

/** Forwards three.js DefaultLoadingManager progress to the main-bundle preloader. */
export const ProgressBridge = () => {
  const progress = useProgress((s) => s.progress)
  useEffect(() => {
    loadingActions.assetsProgress(progress)
  }, [progress])
  return null
}

/** Exposes a high-resolution capture of the live renderer to Photo Mode UI. */
export const CaptureBridge = () => {
  const gl = useThree((s) => s.gl)
  const scene = useThree((s) => s.scene)
  const camera = useThree((s) => s.camera)
  const setDpr = useThree((s) => s.setDpr)
  const viewportDpr = useThree((s) => s.viewport.dpr)

  useEffect(() => {
    registerCapture(
      (scale) =>
        new Promise<Blob>((resolve, reject) => {
          const previous = viewportDpr
          gl.setPixelRatio(Math.min(4, scale))
          gl.render(scene, camera)
          // Read back synchronously right after rendering (no preserveDrawingBuffer needed).
          gl.domElement.toBlob((blob) => {
            gl.setPixelRatio(previous)
            setDpr(previous)
            if (blob) resolve(blob)
            else reject(new Error('Capture failed: the browser returned an empty image.'))
          }, 'image/png')
        }),
    )
    return () => registerCapture(null)
  }, [gl, scene, camera, setDpr, viewportDpr])

  return null
}

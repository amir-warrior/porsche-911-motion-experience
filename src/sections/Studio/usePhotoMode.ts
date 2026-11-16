import { useCallback, useState } from 'react'
import { captureFrame, downloadBlob } from '../../three/capture/photoMode'
import { sceneStore } from '../../store/sceneStore'

export type CaptureStatus = 'idle' | 'busy' | 'saved' | 'error'

const CAPTURE_SCALE = 2
const STATUS_RESET_MS = 2600

/** Photo Mode: render the current composition at 2x and download it as PNG. */
export const usePhotoMode = () => {
  const [status, setStatus] = useState<CaptureStatus>('idle')

  const capture = useCallback(async () => {
    setStatus('busy')
    try {
      const blob = await captureFrame(CAPTURE_SCALE)
      const { environment, paintId } = sceneStore.getState()
      downloadBlob(blob, '911-beyond-limits-' + environment + '-' + paintId + '.png')
      setStatus('saved')
    } catch (error) {
      console.error('[photo-mode] capture failed', error)
      setStatus('error')
    } finally {
      window.setTimeout(() => setStatus('idle'), STATUS_RESET_MS)
    }
  }, [])

  return { status, capture }
}

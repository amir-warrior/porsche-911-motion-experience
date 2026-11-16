export type DeviceTier = 'high' | 'low'

export interface DeviceSignals {
  readonly coarsePointer: boolean
  readonly cores: number
  readonly memoryGb: number | undefined
  readonly viewportWidth: number
}

/**
 * Decide the rendering tier from coarse hardware signals.
 * Low tier = capped DPR, no real-time shadow maps, lighter environment map.
 */
export const classifyDevice = ({ coarsePointer, cores, memoryGb, viewportWidth }: DeviceSignals): DeviceTier => {
  if (memoryGb !== undefined && memoryGb <= 4) return 'low'
  if (cores > 0 && cores <= 4) return 'low'
  if (coarsePointer && viewportWidth < 1024) return 'low'
  return 'high'
}

export const readDeviceSignals = (): DeviceSignals => {
  const nav = navigator as Navigator & { deviceMemory?: number }
  return {
    coarsePointer: window.matchMedia?.('(pointer: coarse)').matches ?? false,
    cores: nav.hardwareConcurrency ?? 8,
    memoryGb: nav.deviceMemory,
    viewportWidth: window.innerWidth,
  }
}

/** True when a WebGL2 (or WebGL1) context can be created. */
export const supportsWebGL = (): boolean => {
  try {
    const canvas = document.createElement('canvas')
    return Boolean(canvas.getContext('webgl2') ?? canvas.getContext('webgl'))
  } catch {
    return false
  }
}

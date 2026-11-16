/**
 * Photo Mode: renders the live scene at a higher pixel ratio and hands back a PNG.
 * The renderer registers itself here so DOM UI can trigger a capture without
 * importing three.js into the main bundle.
 */
export type CaptureFn = (scale: number) => Promise<Blob>

let captureFn: CaptureFn | null = null

export const registerCapture = (fn: CaptureFn | null): void => {
  captureFn = fn
}

export const canCapture = (): boolean => captureFn !== null

export const captureFrame = async (scale = 2): Promise<Blob> => {
  if (!captureFn) throw new Error('The 3D stage is not ready for capture yet.')
  return captureFn(scale)
}

export const downloadBlob = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.append(link)
  link.click()
  link.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}

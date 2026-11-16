import { isEnvironmentId, type EnvironmentId } from './environments'
import raw from './gallery.json'
import { SHOTS, type ShotId } from './shots'

export type GalleryLayout = 'wide' | 'panorama' | 'tall'

/** A still rendered from the live 3D scene by scripts/capture-renders.mjs. */
export interface GalleryItem {
  readonly id: string
  readonly shot: ShotId
  readonly env: EnvironmentId
  readonly paint: string
  readonly width: number
  readonly height: number
  readonly layout: GalleryLayout
  readonly caption: string
  readonly alt: string
}

const isShotId = (value: string): value is ShotId => value in SHOTS
const isLayout = (value: string): value is GalleryLayout => ['wide', 'panorama', 'tall'].includes(value)

/** Validate the manifest at the boundary so a typo fails loudly, not silently. */
export const parseGallery = (items: readonly Record<string, unknown>[]): GalleryItem[] =>
  items.map((item, i) => {
    const { id, shot, env, paint, width, height, layout, caption, alt } = item
    if (typeof id !== 'string' || typeof shot !== 'string' || !isShotId(shot)) throw new Error('gallery[' + i + ']: bad id/shot')
    if (!isEnvironmentId(env)) throw new Error('gallery[' + i + ']: bad env')
    if (typeof layout !== 'string' || !isLayout(layout)) throw new Error('gallery[' + i + ']: bad layout')
    if (typeof width !== 'number' || typeof height !== 'number') throw new Error('gallery[' + i + ']: bad size')
    if (typeof paint !== 'string' || typeof caption !== 'string' || typeof alt !== 'string' || alt.length < 20)
      throw new Error('gallery[' + i + ']: missing text')
    return { id, shot, env, paint, width, height, layout, caption, alt }
  })

export const GALLERY: readonly GalleryItem[] = parseGallery(raw)

export const renderSrc = (id: string, size: 'sm' | 'lg', format: 'avif' | 'webp'): string =>
  '/images/renders/' + id + '-' + size + '.' + format

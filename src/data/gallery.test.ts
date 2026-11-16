import { describe, expect, it } from 'vitest'
import { GALLERY, parseGallery, renderSrc } from './gallery'

describe('gallery manifest', () => {
  it('parses every render with alt text', () => {
    expect(GALLERY.length).toBeGreaterThanOrEqual(8)
    expect(new Set(GALLERY.map((g) => g.id)).size).toBe(GALLERY.length)
  })

  it('rejects malformed entries', () => {
    expect(() => parseGallery([{ id: 'x', shot: 'nope' }])).toThrow(/bad id\/shot/)
    expect(() => parseGallery([{ id: 'x', shot: 'hero', env: 'noon' }])).toThrow(/bad env/)
    expect(() =>
      parseGallery([{ id: 'x', shot: 'hero', env: 'night', layout: 'wide', width: 1, height: 1, paint: 'a', caption: 'c', alt: 'short' }]),
    ).toThrow(/missing text/)
  })

  it('builds asset paths', () => {
    expect(renderSrc('hero-studio', 'lg', 'avif')).toBe('/images/renders/hero-studio-lg.avif')
  })
})

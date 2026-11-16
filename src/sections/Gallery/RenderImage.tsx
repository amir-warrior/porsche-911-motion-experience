import { renderSrc, type GalleryItem } from '../../data/gallery'

interface RenderImageProps {
  readonly item: GalleryItem
  readonly sizes: string
  readonly className?: string
  readonly eager?: boolean
}

/** Responsive AVIF/WebP picture for a scene render with explicit dimensions (no CLS). */
export const RenderImage = ({ item, sizes, className, eager = false }: RenderImageProps) => (
  <picture>
    <source
      type="image/avif"
      sizes={sizes}
      srcSet={renderSrc(item.id, 'sm', 'avif') + ' 1200w, ' + renderSrc(item.id, 'lg', 'avif') + ' ' + item.width + 'w'}
    />
    <img
      src={renderSrc(item.id, 'lg', 'webp')}
      srcSet={renderSrc(item.id, 'sm', 'webp') + ' 1200w, ' + renderSrc(item.id, 'lg', 'webp') + ' ' + item.width + 'w'}
      sizes={sizes}
      width={item.width}
      height={item.height}
      alt={item.alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      className={className}
    />
  </picture>
)

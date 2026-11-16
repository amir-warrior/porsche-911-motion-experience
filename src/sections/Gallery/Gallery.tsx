import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { Maximize2 } from 'lucide-react'
import { useRef, useState } from 'react'
import { registerReveals } from '../../animations/scroll/reveals'
import { SectionLabel } from '../../components/UI/SectionLabel'
import { SplitWords } from '../../components/UI/SplitWords'
import { GALLERY, type GalleryLayout } from '../../data/gallery'
import { useReducedMotion } from '../../hooks/useMediaQuery'
import { Lightbox } from './Lightbox'
import { RenderImage } from './RenderImage'

/** Editorial, asymmetric spans on a 12-column grid. */
const SPAN: Record<GalleryLayout, string> = {
  wide: 'md:col-span-7',
  panorama: 'md:col-span-12',
  tall: 'md:col-span-5',
}
const OFFSET = ['', 'md:mt-24', '', 'md:-mt-16', 'md:mt-10', '', 'md:mt-20', '']

export const Gallery = () => {
  const root = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const [open, setOpen] = useState<number | null>(null)

  useGSAP(
    () => {
      const section = root.current
      if (!section) return
      registerReveals(section, reduced)
      if (reduced) return
      gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((img) => {
        gsap.fromTo(img, { yPercent: -6 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: img.parentElement, scrub: true } })
      })
    },
    { scope: root, dependencies: [reduced] },
  )

  return (
    <section ref={root} id="gallery" aria-labelledby="gallery-title" className="relative px-gutter pt-28 pb-32 md:pt-40">
      <div className="mb-14 grid gap-8 md:mb-20 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <SectionLabel index="07">Gallery</SectionLabel>
          <div data-split-heading className="mt-6">
            <SplitWords as="h2" id="gallery-title" text={'Frames from\nthe stage'} className="type-headline text-[12vw] md:text-[7vw]" />
          </div>
        </div>
        <p data-reveal className="type-body max-w-xs text-sm">
          Every image here was rendered from this site's own real-time scene — the same model, lights and paints you
          control in the studio.
        </p>
      </div>

      <ul className="grid grid-cols-1 gap-5 md:grid-cols-12 md:gap-6">
        {GALLERY.map((item, i) => (
          <li key={item.id} className={SPAN[item.layout] + ' ' + (OFFSET[i] ?? '')}>
            <button
              type="button"
              data-cursor="view"
              onClick={() => setOpen(i)}
              aria-label={'Open render: ' + item.caption}
              className="group block w-full text-left"
            >
              <span data-clip className="relative block overflow-hidden bg-surface" style={{ aspectRatio: item.width + ' / ' + item.height }}>
                <span data-parallax className="absolute -inset-y-[8%] inset-x-0 block">
                  <RenderImage
                    item={item}
                    sizes="(min-width: 768px) 60vw, 100vw"
                    className="h-full w-full scale-100 object-cover transition-transform duration-[1400ms] ease-[var(--ease-out-expo)] group-hover:scale-[1.04]"
                  />
                </span>
                <span className="absolute top-4 right-4 grid size-9 place-items-center border border-paper/40 bg-ink/40 opacity-0 backdrop-blur-sm transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100">
                  <Maximize2 className="size-3.5" aria-hidden="true" />
                </span>
              </span>
              <span className="type-label mt-3 flex justify-between text-mute transition-colors group-hover:text-paper">
                <span>{item.caption}</span>
                <span>{String(i + 1).padStart(2, '0')}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      <Lightbox items={GALLERY} index={open} onClose={() => setOpen(null)} onNavigate={setOpen} reduced={reduced} />
    </section>
  )
}

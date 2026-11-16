import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { useRef } from 'react'
import { setScrollShot } from '../../animations/director'
import { JOURNEY_CHAPTERS } from '../../data/journey'
import { JOURNEY_SHOTS } from '../../data/shots'
import { useReducedMotion } from '../../hooks/useMediaQuery'
import { sampleShots } from '../../utils/cameraPath'

const SCROLL_PER_CHAPTER_VH = 90

/**
 * Pinned scroll journey. Scroll position scrubs the camera through five
 * compositions (front → profile → rear → wheel → plan) while chapter copy
 * crossfades. Scroll stays free: no snapping, no hijacking.
 */
export const Journey = () => {
  const root = useRef<HTMLElement>(null)
  const pin = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const segments = JOURNEY_CHAPTERS.length

  useGSAP(
    () => {
      const section = root.current
      if (!section || !pin.current) return

      const chapters = gsap.utils.toArray<HTMLElement>('[data-chapter]')
      const ticks = gsap.utils.toArray<HTMLElement>('[data-tick]')
      gsap.set(chapters, { autoAlpha: 0 })

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom bottom',
          pin: pin.current,
          pinSpacing: false,
          scrub: reduced ? true : 0.6,
          onUpdate: (self) => setScrollShot(sampleShots(JOURNEY_SHOTS, self.progress)),
          onEnter: () => setScrollShot(sampleShots(JOURNEY_SHOTS, 0)),
        },
      })

      chapters.forEach((chapter, i) => {
        const words = chapter.querySelectorAll('[data-split-word]')
        const fade = chapter.querySelectorAll('[data-chapter-fade]')
        // Timeline time i..i+1 = camera travelling from shot i to shot i+1;
        // chapter i describes shot i+1, so it arrives as the camera settles.
        const at = i + 0.5
        tl.set(chapter, { autoAlpha: 1 }, at)
          .fromTo(words, { yPercent: 115 }, { yPercent: 0, duration: 0.3, stagger: 0.03, ease: 'power3.out' }, at)
          .fromTo(fade, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.3 }, at + 0.08)
          .to(ticks[i] ?? [], { scaleX: 1, duration: 0.7 }, at)
        if (i < chapters.length - 1) {
          tl.to(words, { yPercent: -115, duration: 0.25, stagger: 0.02, ease: 'power3.in' }, i + 1.25)
            .to(fade, { autoAlpha: 0, duration: 0.2 }, i + 1.25)
            .set(chapter, { autoAlpha: 0 }, i + 1.5)
        }
      })
      // Keep timeline length equal to the camera path so both stay in sync.
      tl.set({}, {}, segments)
    },
    { scope: root, dependencies: [reduced, segments] },
  )

  return (
    <section
      ref={root}
      id="journey"
      aria-label="Design journey"
      className="relative z-10"
      style={{ height: String(segments * SCROLL_PER_CHAPTER_VH + 100) + 'svh' }}
    >
      <div ref={pin} className="relative h-[100svh] w-full overflow-hidden">
        <div className="absolute inset-x-0 top-24 flex items-start justify-between px-gutter md:top-28">
          <p className="type-label text-mute">
            <span className="text-paper">02</span> — The journey
          </p>
          <ol aria-hidden="true" className="flex w-40 gap-1.5 md:w-56">
            {JOURNEY_CHAPTERS.map((c) => (
              <li key={c.index} className="h-px flex-1 bg-line">
                <span data-tick className="block h-full origin-left scale-x-0 bg-paper" />
              </li>
            ))}
          </ol>
        </div>

        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/90 via-ink/40 to-transparent px-gutter pt-24 pb-10 md:bg-none md:pb-14">
          <div className="relative min-h-[15rem] max-w-xl md:min-h-[17rem]">
            {JOURNEY_CHAPTERS.map((chapter) => (
              <article key={chapter.index} data-chapter className="invisible absolute inset-x-0 bottom-0">
                <p data-chapter-fade className="type-label mb-4 flex gap-3 text-mute">
                  <span className="text-accent">{chapter.index}</span>
                  {chapter.kicker}
                </p>
                <h2 className="type-headline text-[11vw] text-paper sm:text-6xl md:text-7xl" aria-label={chapter.title}>
                  {chapter.title.split(' ').map((word, i) => (
                    <span key={i} aria-hidden="true" className="split-line inline-block align-top">
                      <span data-split-word className="inline-block">
                        {word}&nbsp;
                      </span>
                    </span>
                  ))}
                </h2>
                <p data-chapter-fade className="type-body mt-5 max-w-md">
                  {chapter.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

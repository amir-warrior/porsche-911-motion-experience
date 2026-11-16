import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ArrowUp, CodeXml } from 'lucide-react'
import { useRef } from 'react'
import { registerReveals } from '../../animations/scroll/reveals'
import { scrollToTarget } from '../../animations/scroll/smoothScroll'
import { createShotTrigger } from '../../animations/scroll/stageTriggers'
import { CtaButton } from '../../components/UI/CtaButton'
import { SplitWords } from '../../components/UI/SplitWords'
import { SHOTS } from '../../data/shots'
import { SITE } from '../../data/site'
import { useReducedMotion } from '../../hooks/useMediaQuery'

/** Closing frame: the car returns, rim-lit, under one last line of type. */
export const Finale = () => {
  const root = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()

  useGSAP(
    () => {
      const section = root.current
      if (!section) return
      registerReveals(section, reduced)
      if (!reduced) {
        gsap.from('[data-finale-rule]', {
          scaleX: 0,
          transformOrigin: 'left',
          ease: 'none',
          scrollTrigger: { trigger: section, start: 'top 70%', end: 'bottom bottom', scrub: true },
        })
      }
      return createShotTrigger(section, { shot: SHOTS.finale, start: 'top 60%', end: 'bottom top' })
    },
    { scope: root, dependencies: [reduced] },
  )

  return (
    <section ref={root} id="finale" aria-labelledby="finale-title" className="relative z-10 flex min-h-[110svh] flex-col justify-end px-gutter pb-14">
      <p data-reveal className="type-label mb-6 text-mute">
        <span className="text-paper">08</span> — End credits
      </p>
      <div data-split-heading>
        <SplitWords as="h2" id="finale-title" text={'The rest\nis road.'} className="type-display text-[17vw] md:text-[11vw]" />
      </div>
      <div data-finale-rule aria-hidden="true" className="mt-8 h-px w-full bg-line-strong" />
      <div data-reveal className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <p className="type-label max-w-sm text-mute">
          711 PS · 800 Nm · 2.5 s · 322 km/h — designed and built as a creative development study.
        </p>
        <div className="flex flex-wrap gap-3">
          <CtaButton onClick={() => scrollToTarget(0)} icon={<ArrowUp className="size-4" aria-hidden="true" />}>
            Replay
          </CtaButton>
          <a
            href={SITE.repoUrl}
            target="_blank"
            rel="noreferrer"
            data-cursor="hover"
            className="type-label group relative inline-flex items-center gap-4 overflow-hidden border border-paper bg-paper px-6 py-4 text-ink transition-colors duration-500 hover:text-paper"
          >
            <span aria-hidden="true" className="absolute inset-0 origin-bottom scale-y-0 bg-accent transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-y-100" />
            <span className="relative">View source</span>
            <CodeXml className="relative size-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  )
}

import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { AnimatePresence, m } from 'motion/react'
import { useRef, useState } from 'react'
import { registerReveals } from '../../animations/scroll/reveals'

import { SectionLabel } from '../../components/UI/SectionLabel'
import { SplitWords } from '../../components/UI/SplitWords'
import { ENGINEERING_STEPS, type EngineeringStep } from '../../data/engineering'
import { SOURCES } from '../../data/sources'
import { useReducedMotion } from '../../hooks/useMediaQuery'
import { HybridSchematic } from './HybridSchematic'

const firstStep = ENGINEERING_STEPS[0] as EngineeringStep

/** T-Hybrid engineering: a scroll-stepped schematic with verified figures. */
export const Engineering = () => {
  const root = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const [stepIndex, setStepIndex] = useState(0)
  const step = ENGINEERING_STEPS[stepIndex] ?? firstStep

  useGSAP(
    () => {
      const section = root.current
      if (!section) return
      registerReveals(section, reduced)
      const stepper = ScrollTrigger.create({
        trigger: '[data-steps]',
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) =>
          setStepIndex(Math.min(ENGINEERING_STEPS.length - 1, Math.floor(self.progress * ENGINEERING_STEPS.length))),
      })
      return () => stepper.kill()
    },
    { scope: root, dependencies: [reduced] },
  )

  return (
    <section ref={root} id="engineering" aria-labelledby="engineering-title" className="relative z-10 bg-ink">
      <header className="px-gutter pt-32 pb-12 md:pt-44">
        <SectionLabel index="04">T-Hybrid engineering</SectionLabel>
        <div className="mt-8 grid gap-8 md:grid-cols-[1.2fr_1fr] md:items-end">
          <div data-split-heading>
            <SplitWords as="h2" id="engineering-title" text={'Electrified\nboost'} className="type-headline text-[14vw] md:text-[8.5vw]" />
          </div>
          <p data-reveal className="type-body max-w-md">
            Porsche calls it a performance hybrid: electric motors where response matters most — inside the
            turbochargers and the gearbox — rather than an electric driving range.
          </p>
        </div>
      </header>

      <div data-steps style={{ height: String(ENGINEERING_STEPS.length * 80 + 20) + 'svh' }} className="relative">
        <div className="sticky top-0 grid h-[100svh] content-center gap-8 px-gutter py-20 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:gap-14">
          <div className="order-2 md:order-1">
            <ol className="mb-8 flex gap-2" aria-label="Engineering steps">
              {ENGINEERING_STEPS.map((s, i) => (
                <li
                  key={s.index}
                  aria-current={i === stepIndex ? 'step' : undefined}
                  className={'type-label border-t pt-2 pr-3 transition-colors duration-500 ' + (i === stepIndex ? 'border-accent text-paper' : 'border-line text-mute')}
                >
                  {s.index}
                </li>
              ))}
            </ol>
            <div aria-live="polite" className="min-h-[18rem]">
              <AnimatePresence mode="wait">
                <m.div
                  key={step.index}
                  initial={reduced ? false : { opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduced ? { opacity: 0 } : { opacity: 0, y: -16 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <h3 className="type-headline text-4xl md:text-5xl">{step.title}</h3>
                  <p className="type-body mt-4 max-w-sm text-sm md:text-base">{step.body}</p>
                  <dl className="mt-8 grid grid-cols-2 gap-6">
                    {step.figures.map((f) => (
                      <div key={f.label} className="border-t border-line pt-3">
                        <dd className="type-headline tabular text-3xl md:text-4xl">{f.value}</dd>
                        <dt className="type-label mt-2 text-mute">{f.label}</dt>
                      </div>
                    ))}
                  </dl>
                </m.div>
              </AnimatePresence>
            </div>
          </div>
          <figure className="order-1 md:order-2">
            <HybridSchematic step={step} reduced={reduced} />
            <figcaption className="type-label mt-4 flex flex-wrap justify-between gap-2 text-mute">
              <span>Schematic · illustrative positions · not a simulation</span>
              <a href={SOURCES.powertrain} target="_blank" rel="noreferrer" className="underline decoration-line-strong underline-offset-4 hover:text-paper">
                Source · Porsche Newsroom
              </a>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  )
}

import { useGSAP } from '@gsap/react'
import { X } from 'lucide-react'
import { AnimatePresence, m } from 'motion/react'
import { useEffect, useRef } from 'react'
import { registerReveals } from '../../animations/scroll/reveals'
import { createShotTrigger } from '../../animations/scroll/stageTriggers'
import { SectionLabel } from '../../components/UI/SectionLabel'
import { SplitWords } from '../../components/UI/SplitWords'
import { findHotspot, HOTSPOTS } from '../../data/hotspots'
import { SHOTS } from '../../data/shots'
import { SOURCES } from '../../data/sources'
import { useReducedMotion } from '../../hooks/useMediaQuery'
import { useSceneStore } from '../../hooks/useSceneStore'
import { sceneActions } from '../../store/sceneStore'

/** Design & aerodynamics: numbered hotspots on the live model, mirrored by an accessible list. */
export const Design = () => {
  const root = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const activeId = useSceneStore((s) => s.activeHotspot)
  const active = findHotspot(activeId)

  useGSAP(
    () => {
      const section = root.current
      if (!section) return
      registerReveals(section, reduced)
      return createShotTrigger(section, {
        shot: SHOTS.design,
        start: 'top 60%',
        end: 'bottom 40%',
        onToggle: (on) => sceneActions.setHotspotsVisible(on),
      })
    },
    { scope: root, dependencies: [reduced] },
  )

  useEffect(() => {
    if (!activeId) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && sceneActions.focusHotspot(null)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [activeId])

  return (
    <section ref={root} id="design" aria-labelledby="design-title" className="relative z-10 h-[220svh]">
      <div className="sticky top-0 flex h-[100svh] flex-col justify-between px-gutter pt-24 pb-8 md:pt-28 md:pb-10">
        <div className="max-w-md">
          <SectionLabel index="03">Design &amp; aerodynamics</SectionLabel>
          <div data-split-heading className="mt-6">
            <SplitWords as="h2" id="design-title" text={'Shaped\nby air'} className="type-headline text-[13vw] md:text-8xl" />
          </div>
          <p data-reveal className="type-body mt-6 hidden md:block">
            Every opening on the nose is active. Select a point on the car — or a detail below — to move the camera
            and read what it does.
          </p>
        </div>

        <div className="grid items-end gap-6 md:grid-cols-[minmax(0,22rem)_1fr]">
          <ol data-reveal className="border-t border-line">
            {HOTSPOTS.map((spot, i) => {
              const isActive = spot.id === activeId
              return (
                <li key={spot.id} className="border-b border-line">
                  <button
                    type="button"
                    data-cursor="hover"
                    aria-pressed={isActive}
                    onClick={() => sceneActions.focusHotspot(isActive ? null : spot.id)}
                    className={[
                      'type-label group flex w-full items-center gap-4 py-2.5 text-left transition-colors md:py-3',
                      isActive ? 'text-paper' : 'text-mute hover:text-paper',
                    ].join(' ')}
                  >
                    <span className={isActive ? 'text-accent' : ''}>{String(i + 1).padStart(2, '0')}</span>
                    <span className="flex-1">{spot.label}</span>
                    <span
                      aria-hidden="true"
                      className={'h-px bg-paper transition-all duration-500 ' + (isActive ? 'w-8' : 'w-0 group-hover:w-4')}
                    />
                  </button>
                </li>
              )
            })}
          </ol>

          <div className="min-h-[10rem] md:justify-self-end" aria-live="polite">
            <AnimatePresence mode="wait">
              {active ? (
                <m.article
                  key={active.id}
                  initial={reduced ? false : { opacity: 0, y: 24, clipPath: 'inset(0% 0% 100% 0%)' }}
                  animate={{ opacity: 1, y: 0, clipPath: 'inset(0% 0% 0% 0%)' }}
                  exit={reduced ? { opacity: 0 } : { opacity: 0, y: -12 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="relative max-w-sm border border-line bg-ink/80 p-6 backdrop-blur-md"
                >
                  <button
                    type="button"
                    onClick={() => sceneActions.focusHotspot(null)}
                    aria-label="Close detail"
                    className="absolute top-4 right-4 text-mute transition-colors hover:text-paper"
                  >
                    <X className="size-4" aria-hidden="true" />
                  </button>
                  <p className="type-label text-accent">{active.label}</p>
                  <h3 className="type-headline mt-3 text-3xl">{active.title}</h3>
                  <p className="type-body mt-4 text-sm">{active.body}</p>
                  <a
                    href={SOURCES[active.source]}
                    target="_blank"
                    rel="noreferrer"
                    className="type-label mt-5 inline-block text-mute underline decoration-line-strong underline-offset-4 hover:text-paper"
                  >
                    Source · Porsche Newsroom
                  </a>
                </m.article>
              ) : (
                <p className="type-label max-w-[16rem] text-mute md:text-right">Six active and design details · select one</p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}

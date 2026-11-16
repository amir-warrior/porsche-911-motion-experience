import { useGSAP } from '@gsap/react'
import { useEffect, useRef } from 'react'
import { registerReveals } from '../../animations/scroll/reveals'
import { lockScroll } from '../../animations/scroll/smoothScroll'
import { makeInert } from '../../utils/inert'
import { createShotTrigger } from '../../animations/scroll/stageTriggers'
import { SectionLabel } from '../../components/UI/SectionLabel'
import { SplitWords } from '../../components/UI/SplitWords'
import { SHOTS } from '../../data/shots'
import { useReducedMotion } from '../../hooks/useMediaQuery'
import { useSceneStore } from '../../hooks/useSceneStore'
import { sceneActions } from '../../store/sceneStore'
import { ExploreHint } from './ExploreHint'
import { StudioPanel } from './StudioPanel'

/** Light Studio + configurator section. */
export const Studio = () => {
  const root = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const exploring = useSceneStore((s) => s.mode === 'explore')

  useGSAP(
    () => {
      const section = root.current
      if (!section) return
      registerReveals(section, reduced)
      return createShotTrigger(section, {
        shot: SHOTS.studio,
        start: 'top 55%',
        end: 'bottom 45%',
        onToggle: (on) => {
          if (!on) sceneActions.setPreset(null)
        },
      })
    },
    { scope: root, dependencies: [reduced] },
  )

  // Explore mode owns wheel/touch input: freeze page scroll, hide the nav from
  // keyboard users, Esc to leave, and hand focus back to "Free cam" afterwards.
  useEffect(() => {
    if (!exploring) return
    const unlock = lockScroll()
    const unInert = makeInert(['header', 'footer'])
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && sceneActions.exitExplore()
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      unInert()
      unlock()
      requestAnimationFrame(() => document.querySelector<HTMLElement>('[data-free-cam]')?.focus())
    }
  }, [exploring])

  return (
    <section
      ref={root}
      id="studio"
      aria-labelledby="studio-title"
      className="relative z-10 flex min-h-[100svh] flex-col justify-between gap-10 px-gutter pt-24 pb-8 md:flex-row md:items-end md:pt-28 md:pb-12"
    >
      <div className={'max-w-md self-start transition-opacity duration-500 ' + (exploring ? 'pointer-events-none opacity-0' : '')}>
        <SectionLabel index="06">Light studio</SectionLabel>
        <div data-split-heading className="mt-6">
          <SplitWords as="h2" id="studio-title" text={'Set the\nscene'} className="type-headline text-[13vw] md:text-8xl" />
        </div>
        <p data-reveal className="type-body mt-5 hidden max-w-sm md:block">
          Light, paint and camera are live. Changing the mood rebuilds the environment reflections and moves real
          lights. Keep the frame with Photo Mode.
        </p>
      </div>
      {exploring ? <ExploreHint /> : <StudioPanel />}
    </section>
  )
}

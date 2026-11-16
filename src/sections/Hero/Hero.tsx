import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ArrowDownRight, Rotate3d } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { DAMPING, director, setPointer, setScrollShot } from '../../animations/director'
import { createShotTrigger } from '../../animations/scroll/stageTriggers'
import { scrollToTarget } from '../../animations/scroll/smoothScroll'
import { CtaButton } from '../../components/UI/CtaButton'
import { SplitWords } from '../../components/UI/SplitWords'
import { SHOTS } from '../../data/shots'
import { HERO_FIGURES } from '../../data/specs'
import { FINE_POINTER_QUERY, useMediaQuery, useReducedMotion } from '../../hooks/useMediaQuery'
import { useSceneStore } from '../../hooks/useSceneStore'
import { sceneActions } from '../../store/sceneStore'
import { lerpShot } from '../../utils/cameraPath'

/** Glide to the studio first; only take over the camera once the scroll has landed. */
const goExplore = () => scrollToTarget('#studio', { onComplete: sceneActions.enterExplore })

/** The numeral lives in StageLayer (outside this section's GSAP scope), so pass the element itself. */
const stageNumeral = (): Element[] => Array.from(document.querySelectorAll('[data-stage-numeral]'))

export const Hero = () => {
  const root = useRef<HTMLElement>(null)
  const introDone = useSceneStore((s) => s.introDone)
  const reduced = useReducedMotion()
  const finePointer = useMediaQuery(FINE_POINTER_QUERY)

  useEffect(() => {
    director.lambda = reduced ? DAMPING.reduced : DAMPING.cinematic
  }, [reduced])

  // Pointer parallax for the camera (desktop only, never under reduced motion).
  useEffect(() => {
    if (!finePointer || reduced) return
    const onMove = (e: PointerEvent) =>
      setPointer((e.clientX / window.innerWidth) * 2 - 1, -((e.clientY / window.innerHeight) * 2 - 1))
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      setPointer(0, 0)
    }
  }, [finePointer, reduced])

  // Intro: dolly-in, numeral rise, headline stagger.
  useGSAP(
    () => {
      if (!introDone) return
      if (reduced) {
        setScrollShot(SHOTS.hero)
        return
      }
      const dolly = { t: 0 }
      gsap
        .timeline({ defaults: { ease: 'expo.out' } })
        .to(dolly, {
          t: 1,
          duration: 2.8,
          ease: 'expo.inOut',
          onUpdate: () => setScrollShot(lerpShot(SHOTS.intro, SHOTS.hero, dolly.t)),
        })
        .fromTo(stageNumeral(), { yPercent: 18, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 2.4 }, 0.3)
        .fromTo(
          '[data-hero-title] [data-split-word]',
          { yPercent: 118, rotate: 5 },
          { yPercent: 0, rotate: 0, duration: 1.4, stagger: 0.08 },
          0.9,
        )
        .fromTo('[data-hero-fade]', { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1.2, stagger: 0.08 }, 1.2)
        .fromTo(
          '[data-hero-rule]',
          { scaleX: 0 },
          { scaleX: 1, transformOrigin: 'left', duration: 1.6, ease: 'expo.inOut' },
          1.1,
        )
    },
    { scope: root, dependencies: [introDone, reduced] },
  )

  // Scroll: hold the hero composition, drift the numeral and headline away.
  useGSAP(
    () => {
      const section = root.current
      if (!section) return
      const cleanup = createShotTrigger(section, { shot: SHOTS.hero, start: 'top top', end: 'bottom 40%' })
      if (!reduced) {
        const scrub = { trigger: section, start: 'top top', end: 'bottom top', scrub: true }
        // Explicit start values + no immediate render: never fights the intro timeline.
        gsap.fromTo(
          stageNumeral(),
          { yPercent: 0, autoAlpha: 1 },
          { yPercent: -35, autoAlpha: 0, ease: 'none', immediateRender: false, scrollTrigger: scrub },
        )
        gsap.fromTo(
          '[data-hero-title]',
          { yPercent: 0 },
          { yPercent: -40, ease: 'none', immediateRender: false, scrollTrigger: scrub },
        )
      }
      return cleanup
    },
    { scope: root, dependencies: [reduced] },
  )

  return (
    <section ref={root} id="top" aria-labelledby="hero-title" className="relative z-10 flex h-[100svh] min-h-[600px] flex-col justify-end px-gutter pb-8 md:pb-10">
      <div className="absolute inset-x-0 top-24 px-gutter md:top-28">
        <p data-hero-fade className="type-label flex flex-wrap items-center gap-x-3 gap-y-1 text-mute">
          <span className="inline-block size-1.5 bg-accent" aria-hidden="true" />
          <span className="text-paper">911 Turbo S</span>
          <span>992.2 · Model year 2026</span>
          <span className="hidden sm:inline">· T-Hybrid</span>
        </p>
      </div>

      <div className="grid items-end gap-8 md:grid-cols-[1fr_auto]">
        <div data-hero-title>
          <SplitWords
            as="h1"
            id="hero-title"
            text={'Beyond\nLimits'}
            className="type-display text-[19vw] text-paper md:text-[12.5vw]"
          />
        </div>

        <dl className="grid grid-cols-3 gap-4 md:mb-3 md:w-72 md:grid-cols-1 md:gap-0">
          {HERO_FIGURES.map((figure) => (
            <div key={figure.label} data-hero-fade className="border-t border-line py-3">
              <dt className="type-label text-mute">{figure.label}</dt>
              <dd className="mt-1 flex items-baseline gap-1.5">
                <span className="type-headline tabular text-2xl md:text-3xl">{figure.value}</span>
                <span className="type-label text-mute">{figure.unit}</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div data-hero-rule aria-hidden="true" className="mt-6 h-px w-full bg-line-strong" />

      <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          data-hero-fade
          data-cursor="hover"
          onClick={() => scrollToTarget('#journey')}
          className="type-label group flex items-center gap-3 text-mute transition-colors hover:text-paper"
        >
          <span className="relative block h-8 w-px overflow-hidden bg-line">
            <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollcue_2.2s_var(--ease-cine)_infinite] bg-paper" />
          </span>
          Scroll to begin
          <ArrowDownRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" aria-hidden="true" />
        </button>
        <div data-hero-fade>
          <CtaButton onClick={goExplore} icon={<Rotate3d className="size-4" aria-hidden="true" />}>
            Explore in 3D
          </CtaButton>
        </div>
      </div>
    </section>
  )
}

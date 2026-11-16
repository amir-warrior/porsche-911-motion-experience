import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { useEffect, useRef, useState } from 'react'
import { setScrollLocked } from '../../animations/scroll/smoothScroll'
import { useLoadingStore } from '../../hooks/useLoadingStore'
import { useReducedMotion } from '../../hooks/useMediaQuery'
import { sceneActions } from '../../store/sceneStore'

gsap.registerPlugin(useGSAP)

/** Waits for web fonts so the hero headline never reflows mid-animation. */
const useFontsReady = (): boolean => {
  const [ready, setReady] = useState(() => typeof document === 'undefined' || !('fonts' in document))
  useEffect(() => {
    if (ready) return
    let alive = true
    document.fonts.ready.then(() => alive && setReady(true)).catch(() => alive && setReady(true))
    return () => {
      alive = false
    }
  }, [ready])
  return ready
}

/**
 * Cinematic preloader. The counter reflects real loading progress
 * (3D chunk → model/assets → fonts) and exits as soon as everything is ready.
 */
export const Preloader = () => {
  const root = useRef<HTMLDivElement>(null)
  const counter = useRef<HTMLSpanElement>(null)
  const shown = useRef({ value: 0 })
  const progress = useLoadingStore((s) => s.progress)
  const assetsDone = useLoadingStore((s) => s.done)
  const fontsReady = useFontsReady()
  const reduced = useReducedMotion()
  const [gone, setGone] = useState(false)
  const done = assetsDone && fontsReady

  useEffect(() => {
    setScrollLocked(true)
    return () => setScrollLocked(false)
  }, [])

  // Ease the displayed number towards real progress (never ahead of it).
  useGSAP(() => {
    gsap.to(shown.current, {
      value: progress,
      duration: reduced ? 0 : 0.6,
      ease: 'power2.out',
      overwrite: true,
      onUpdate: () => {
        if (counter.current) counter.current.textContent = String(Math.round(shown.current.value)).padStart(3, '0')
      },
    })
  }, [progress, reduced])

  useGSAP(
    () => {
      if (!done || !root.current) return
      const finish = () => {
        setScrollLocked(false)
        sceneActions.finishIntro()
        setGone(true)
      }
      if (reduced) {
        gsap.to(root.current, { autoAlpha: 0, duration: 0.3, onComplete: finish })
        return
      }
      gsap
        .timeline({ onComplete: finish })
        .to(shown.current, { value: 100, duration: 0.4, ease: 'power2.out' })
        .to('[data-preloader-line]', { yPercent: -110, duration: 0.8, ease: 'expo.in', stagger: 0.05 }, '+=0.1')
        .to('[data-preloader-bar]', { scaleX: 0, transformOrigin: 'right', duration: 0.6, ease: 'expo.in' }, '<')
        .to(root.current, { clipPath: 'inset(0% 0% 100% 0%)', duration: 1.1, ease: 'expo.inOut' }, '-=0.25')
    },
    { scope: root, dependencies: [done, reduced] },
  )

  if (gone) return null

  return (
    <div
      ref={root}
      role="status"
      aria-live="polite"
      aria-label={done ? 'Experience loaded' : 'Loading experience'}
      className="fixed inset-0 z-[100] flex flex-col justify-between bg-ink px-gutter py-8 [clip-path:inset(0%_0%_0%_0%)]"
    >
      <div className="type-label flex justify-between text-mute">
        <span className="overflow-hidden"><span data-preloader-line className="block">911 — Beyond Limits</span></span>
        <span className="overflow-hidden"><span data-preloader-line className="block">Unofficial portfolio study</span></span>
      </div>

      <div className="flex items-end justify-between gap-6">
        <div className="max-w-xs overflow-hidden">
          <p data-preloader-line className="type-label leading-relaxed text-mute">
            Preparing the stage
            <br />
            <span className="text-paper">3.6 l boxer · T-Hybrid · 711 PS</span>
          </p>
        </div>
        <p className="overflow-hidden">
          <span data-preloader-line className="type-display tabular block text-[22vw] text-paper md:text-[14vw]">
            <span ref={counter}>000</span>
          </span>
        </p>
      </div>

      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-line">
        <div
          data-preloader-bar
          className="h-full origin-left bg-accent transition-transform duration-500"
          style={{ transform: 'scaleX(' + progress / 100 + ')' }}
        />
      </div>
    </div>
  )
}

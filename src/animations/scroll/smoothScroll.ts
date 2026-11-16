import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

let lenis: Lenis | null = null

/**
 * Reference-counted scroll lock. Preloader, lightbox and explore mode can each
 * hold a lock; scrolling resumes only when the last one is released. The lock
 * is applied to both Lenis and the native overflow, and re-applied whenever a
 * Lenis instance is created, so lock/unlock order never leaves a stale state.
 */
let locks = 0

const applyLock = (): void => {
  const locked = locks > 0
  document.documentElement.style.overflow = locked ? 'hidden' : ''
  if (!lenis) return
  if (locked) lenis.stop()
  else lenis.start()
}

/** Acquire a scroll lock; returns its release function (safe to call once). */
export const lockScroll = (): (() => void) => {
  locks += 1
  applyLock()
  let released = false
  return () => {
    if (released) return
    released = true
    locks = Math.max(0, locks - 1)
    applyLock()
  }
}

export const isScrollLocked = (): boolean => locks > 0

/**
 * Start Lenis driven by GSAP's ticker so ScrollTrigger and smooth scroll share
 * one clock (no double rAF, no desync). Returns a teardown function.
 */
export const startSmoothScroll = (): (() => void) => {
  const instance = new Lenis({ duration: 1.15, smoothWheel: true, wheelMultiplier: 0.9 })
  lenis = instance
  applyLock()
  instance.on('scroll', ScrollTrigger.update)
  const tick = (time: number) => instance.raf(time * 1000)
  gsap.ticker.add(tick)
  gsap.ticker.lagSmoothing(0)

  return () => {
    gsap.ticker.remove(tick)
    instance.destroy()
    if (lenis === instance) lenis = null
  }
}

/** Scroll to an element or offset, smoothly when Lenis is active. */
export const scrollToTarget = (
  target: string | HTMLElement | number,
  { immediate = false, onComplete }: { immediate?: boolean; onComplete?: () => void } = {},
): void => {
  if (lenis) {
    lenis.scrollTo(target, { immediate, duration: 1.6, onComplete: () => onComplete?.() })
    return
  }
  if (typeof target === 'number') window.scrollTo({ top: target, behavior: immediate ? 'auto' : 'smooth' })
  else {
    const el = typeof target === 'string' ? document.querySelector(target) : target
    el?.scrollIntoView({ behavior: immediate ? 'auto' : 'smooth' })
  }
  if (onComplete) window.setTimeout(onComplete, immediate ? 0 : 900)
}

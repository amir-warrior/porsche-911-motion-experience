import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

let lenis: Lenis | null = null

/**
 * Start Lenis driven by GSAP's ticker so ScrollTrigger and smooth scroll share
 * one clock (no double rAF, no desync). Returns a teardown function.
 */
export const startSmoothScroll = (): (() => void) => {
  const instance = new Lenis({ duration: 1.15, smoothWheel: true, wheelMultiplier: 0.9 })
  lenis = instance
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
export const scrollToTarget = (target: string | HTMLElement | number, immediate = false): void => {
  if (lenis) {
    lenis.scrollTo(target, { immediate, duration: 1.6 })
    return
  }
  if (typeof target === 'number') {
    window.scrollTo({ top: target, behavior: immediate ? 'auto' : 'smooth' })
    return
  }
  const el = typeof target === 'string' ? document.querySelector(target) : target
  el?.scrollIntoView({ behavior: immediate ? 'auto' : 'smooth' })
}

/** Freeze/unfreeze page scrolling (used while the visitor drives the 3D camera). */
export const setScrollLocked = (locked: boolean): void => {
  if (lenis) {
    if (locked) lenis.stop()
    else lenis.start()
    return
  }
  document.documentElement.style.overflow = locked ? 'hidden' : ''
}

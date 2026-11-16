import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export const EASE = {
  cine: 'power4.inOut',
  out: 'expo.out',
  soft: 'power3.out',
} as const

/**
 * Standard section reveals, scoped to one section element:
 * - `[data-split-heading]` → its `[data-split-word]` children rise out of a mask
 * - `[data-reveal]`        → fade + lift, staggered in DOM order
 * - `[data-clip]`          → clip-path wipe from the bottom
 * Call inside useGSAP so everything is reverted on unmount.
 */
export const registerReveals = (section: HTMLElement, reduced: boolean): void => {
  const headings = section.querySelectorAll<HTMLElement>('[data-split-heading]')
  const blocks = section.querySelectorAll<HTMLElement>('[data-reveal]')
  const clips = section.querySelectorAll<HTMLElement>('[data-clip]')

  if (reduced) {
    gsap.set([...blocks, ...clips], { clearProps: 'all' })
    return
  }

  headings.forEach((heading) => {
    gsap.fromTo(
      heading.querySelectorAll('[data-split-word]'),
      { yPercent: 115, rotate: 4 },
      {
        yPercent: 0,
        rotate: 0,
        duration: 1.2,
        ease: EASE.out,
        stagger: 0.06,
        scrollTrigger: { trigger: heading, start: 'top 85%' },
      },
    )
  })

  blocks.forEach((block) => {
    gsap.fromTo(
      block,
      { y: 36, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 1.1, ease: EASE.soft, scrollTrigger: { trigger: block, start: 'top 88%' } },
    )
  })

  clips.forEach((clip) => {
    gsap.fromTo(
      clip,
      { clipPath: 'inset(100% 0% 0% 0%)' },
      {
        clipPath: 'inset(0% 0% 0% 0%)',
        duration: 1.4,
        ease: EASE.cine,
        scrollTrigger: { trigger: clip, start: 'top 85%' },
      },
    )
  })
}

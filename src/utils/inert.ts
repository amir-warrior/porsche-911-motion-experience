/**
 * Reference-counted `inert` for page regions behind modal UI (preloader,
 * lightbox, explore mode). Each holder gets a release function; an element
 * becomes interactive again only when its last holder releases it.
 */
const counts = new WeakMap<Element, number>()

export const PAGE_REGIONS = ['#main', 'header', 'footer'] as const

export const makeInert = (selectors: readonly string[] = PAGE_REGIONS): (() => void) => {
  const elements = selectors.flatMap((s) => Array.from(document.querySelectorAll(s)))
  elements.forEach((el) => {
    counts.set(el, (counts.get(el) ?? 0) + 1)
    el.setAttribute('inert', '')
  })
  let released = false
  return () => {
    if (released) return
    released = true
    elements.forEach((el) => {
      const next = (counts.get(el) ?? 1) - 1
      counts.set(el, next)
      if (next <= 0) el.removeAttribute('inert')
    })
  }
}

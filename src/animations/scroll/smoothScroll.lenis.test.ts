import { describe, expect, it, vi } from 'vitest'

const instances: { stop: ReturnType<typeof vi.fn>; start: ReturnType<typeof vi.fn>; scrollTo: ReturnType<typeof vi.fn>; destroy: ReturnType<typeof vi.fn> }[] = []
vi.mock('lenis', () => ({
  default: class {
    stop = vi.fn()
    start = vi.fn()
    scrollTo = vi.fn((_t: unknown, opts: { onComplete?: () => void }) => opts.onComplete?.())
    destroy = vi.fn()
    on = vi.fn()
    raf = vi.fn()
    constructor() {
      instances.push(this)
    }
  },
}))
const tickerAdd = vi.fn()
const tickerRemove = vi.fn()
vi.mock('gsap', () => ({
  gsap: { registerPlugin: vi.fn(), ticker: { add: tickerAdd, remove: tickerRemove, lagSmoothing: vi.fn() } },
}))
vi.mock('gsap/ScrollTrigger', () => ({ ScrollTrigger: { update: vi.fn() } }))

const { lockScroll, scrollToTarget, startSmoothScroll } = await import('./smoothScroll')

describe('smooth scroll with Lenis', () => {
  it('honours a lock taken before Lenis starts and releases both lock layers', () => {
    const release = lockScroll()
    const stopLenis = startSmoothScroll()
    const lenis = instances[0]!
    expect(lenis.stop).toHaveBeenCalled()
    expect(document.documentElement.style.overflow).toBe('hidden')
    release()
    expect(lenis.start).toHaveBeenCalled()
    expect(document.documentElement.style.overflow).toBe('')
    stopLenis()
    expect(lenis.destroy).toHaveBeenCalled()
    expect(tickerRemove).toHaveBeenCalled()
  })

  it('routes scrollTo through Lenis and reports completion', () => {
    const stopLenis = startSmoothScroll()
    const onComplete = vi.fn()
    scrollToTarget('#studio', { onComplete })
    expect(instances.at(-1)!.scrollTo).toHaveBeenCalled()
    expect(onComplete).toHaveBeenCalled()
    stopLenis()
  })

  it('falls back to native scrolling without Lenis', () => {
    const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined)
    scrollToTarget(0, { immediate: true })
    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'auto' })
  })
})

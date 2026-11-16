import { describe, expect, it, vi } from 'vitest'

const fromTo = vi.fn()
const set = vi.fn()
vi.mock('gsap', () => ({ gsap: { registerPlugin: vi.fn(), fromTo, set } }))
vi.mock('gsap/ScrollTrigger', () => ({ ScrollTrigger: {} }))

const { registerReveals } = await import('./reveals')

const section = () => {
  const el = document.createElement('section')
  el.innerHTML =
    '<h2 data-split-heading><span data-split-word>A</span></h2><p data-reveal>b</p><div data-clip></div>'
  return el
}

describe('registerReveals', () => {
  it('animates headings, blocks and clips with explicit end values', () => {
    registerReveals(section(), false)
    expect(fromTo).toHaveBeenCalledTimes(3)
    const blockEnd = fromTo.mock.calls[1]![2]
    expect(blockEnd).toMatchObject({ y: 0, autoAlpha: 1 })
  })

  it('leaves content static under reduced motion', () => {
    fromTo.mockClear()
    registerReveals(section(), true)
    expect(fromTo).not.toHaveBeenCalled()
    expect(set).toHaveBeenCalled()
  })
})

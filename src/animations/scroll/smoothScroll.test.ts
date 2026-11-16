import { afterEach, describe, expect, it } from 'vitest'
import { isScrollLocked, lockScroll } from './smoothScroll'

describe('lockScroll', () => {
  afterEach(() => {
    document.documentElement.style.overflow = ''
  })

  it('keeps scrolling locked until every holder releases', () => {
    const releasePreloader = lockScroll()
    const releaseLightbox = lockScroll()
    expect(document.documentElement.style.overflow).toBe('hidden')
    releasePreloader()
    expect(isScrollLocked()).toBe(true)
    releaseLightbox()
    expect(isScrollLocked()).toBe(false)
    expect(document.documentElement.style.overflow).toBe('')
  })

  it('ignores double release', () => {
    const a = lockScroll()
    const b = lockScroll()
    a()
    a()
    expect(isScrollLocked()).toBe(true)
    b()
    expect(isScrollLocked()).toBe(false)
  })
})

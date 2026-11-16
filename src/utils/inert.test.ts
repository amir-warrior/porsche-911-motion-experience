import { describe, expect, it } from 'vitest'
import { makeInert } from './inert'

describe('makeInert', () => {
  it('restores interactivity only after the last holder releases', () => {
    document.body.innerHTML = '<main id="main"></main><header></header>'
    const main = document.getElementById('main')!
    const a = makeInert(['#main'])
    const b = makeInert(['#main', 'header'])
    expect(main.hasAttribute('inert')).toBe(true)
    a()
    a()
    expect(main.hasAttribute('inert')).toBe(true)
    b()
    expect(main.hasAttribute('inert')).toBe(false)
    expect(document.querySelector('header')!.hasAttribute('inert')).toBe(false)
  })
})

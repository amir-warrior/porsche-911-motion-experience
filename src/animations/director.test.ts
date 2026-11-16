import { describe, expect, it } from 'vitest'
import { SHOTS } from '../data/shots'
import { director, setPointer, setScrollShot } from './director'

describe('director', () => {
  it('stores the requested shot and pointer', () => {
    setScrollShot(SHOTS.rear)
    setPointer(0.5, -0.25)
    expect(director.scrollShot).toBe(SHOTS.rear)
    expect(director.pointer).toEqual({ x: 0.5, y: -0.25 })
  })
})

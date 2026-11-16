import { beforeEach, describe, expect, it, vi } from 'vitest'

type Vars = { onToggle?: (self: { isActive: boolean }) => void }
const created: { vars: Vars; self: { isActive: boolean; kill: () => void } }[] = []

vi.mock('gsap/ScrollTrigger', () => ({
  ScrollTrigger: {
    create: (vars: Vars) => {
      const self = { isActive: false, kill: vi.fn() }
      created.push({ vars, self })
      return self
    },
  },
}))

const { createShotTrigger, createSolidTrigger } = await import('./stageTriggers')
const { director } = await import('../director')
const { sceneStore, initialSceneState } = await import('../../store/sceneStore')
const { SHOTS } = await import('../../data/shots')

const toggle = (i: number, isActive: boolean) => {
  const entry = created[i]!
  entry.self.isActive = isActive
  entry.vars.onToggle?.(entry.self)
}

describe('stage triggers', () => {
  beforeEach(() => {
    created.length = 0
    sceneStore.setState(initialSceneState)
  })

  it('hides the stage while any solid zone is active', () => {
    const a = document.createElement('div')
    const b = document.createElement('div')
    const releaseA = createSolidTrigger(a)
    createSolidTrigger(b)
    toggle(0, true)
    toggle(1, true)
    toggle(0, false)
    expect(sceneStore.getState().stageVisible).toBe(false)
    toggle(1, false)
    expect(sceneStore.getState().stageVisible).toBe(true)
    toggle(0, true)
    releaseA()
    expect(sceneStore.getState().stageVisible).toBe(true)
    expect(created[0]!.self.kill).toHaveBeenCalled()
  })

  it('requests a shot on activation and releases section state on cleanup', () => {
    const onToggle = vi.fn()
    const release = createShotTrigger(document.createElement('section'), { shot: SHOTS.plan, onToggle })
    toggle(0, true)
    expect(director.scrollShot).toBe(SHOTS.plan)
    expect(onToggle).toHaveBeenLastCalledWith(true)
    release()
    expect(onToggle).toHaveBeenLastCalledWith(false)
  })
})

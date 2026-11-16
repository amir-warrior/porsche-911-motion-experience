import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createStore } from './createStore'
import { initialSceneState, sceneActions, sceneStore } from './sceneStore'

describe('createStore', () => {
  it('creates a new state object on change and notifies listeners', () => {
    const store = createStore({ a: 1, b: 2 })
    const before = store.getState()
    const listener = vi.fn()
    const unsubscribe = store.subscribe(listener)

    store.setState({ a: 5 })

    expect(store.getState()).toEqual({ a: 5, b: 2 })
    expect(store.getState()).not.toBe(before)
    expect(before).toEqual({ a: 1, b: 2 })
    expect(listener).toHaveBeenCalledTimes(1)
    unsubscribe()
    store.setState({ a: 6 })
    expect(listener).toHaveBeenCalledTimes(1)
  })

  it('skips notifications when nothing changed', () => {
    const store = createStore({ a: 1 })
    const listener = vi.fn()
    store.subscribe(listener)
    store.setState({ a: 1 })
    store.setState((s) => ({ a: s.a }))
    expect(listener).not.toHaveBeenCalled()
  })
})

describe('sceneActions', () => {
  beforeEach(() => sceneStore.setState(initialSceneState))

  it('updates configurator selections', () => {
    sceneActions.setEnvironment('night')
    sceneActions.setPaint('guards-red')
    sceneActions.setWheel('satin-black')
    const s = sceneStore.getState()
    expect([s.environment, s.paintId, s.wheelId]).toEqual(['night', 'guards-red', 'satin-black'])
  })

  it('enters explore mode and clears hotspot focus', () => {
    sceneActions.focusHotspot('rear-wing')
    sceneActions.enterExplore()
    expect(sceneStore.getState()).toMatchObject({ mode: 'explore', activeHotspot: null })
    sceneActions.exitExplore()
    expect(sceneStore.getState().mode).toBe('story')
  })

  it('selecting a camera preset returns control to the story camera', () => {
    sceneActions.enterExplore()
    sceneActions.setPreset('rear')
    expect(sceneStore.getState()).toMatchObject({ mode: 'story', presetShot: 'rear' })
  })

  it('hiding hotspots also clears the focused one', () => {
    sceneActions.setHotspotsVisible(true)
    sceneActions.focusHotspot('headlights')
    sceneActions.setHotspotsVisible(false)
    expect(sceneStore.getState().activeHotspot).toBeNull()
  })

  it('tracks stage, webgl and intro flags', () => {
    sceneActions.setStageVisible(false)
    sceneActions.setWebGL('failed')
    sceneActions.finishIntro()
    expect(sceneStore.getState()).toMatchObject({ stageVisible: false, webgl: 'failed', introDone: true })
  })
})

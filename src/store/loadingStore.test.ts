import { beforeEach, describe, expect, it } from 'vitest'
import { loadingActions, loadingStore } from './loadingStore'

describe('loadingStore', () => {
  beforeEach(() => loadingStore.setState({ progress: 0, done: false }))

  it('weights the chunk and asset phases and never regresses', () => {
    loadingActions.chunkLoaded()
    expect(loadingStore.getState().progress).toBe(15)
    loadingActions.assetsProgress(50)
    expect(loadingStore.getState().progress).toBeCloseTo(57.5)
    loadingActions.assetsProgress(10)
    expect(loadingStore.getState().progress).toBeCloseTo(57.5)
  })

  it('caps asset progress below 100 until explicitly completed', () => {
    loadingActions.assetsProgress(100)
    expect(loadingStore.getState()).toMatchObject({ progress: 99, done: false })
    loadingActions.complete()
    expect(loadingStore.getState()).toEqual({ progress: 100, done: true })
  })
})

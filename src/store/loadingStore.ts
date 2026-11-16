import { createStore } from './createStore'

/** Real loading progress: JS chunk for the 3D stage, then three.js assets, then fonts. */
export interface LoadingState {
  /** 0..100 */
  readonly progress: number
  readonly done: boolean
}

export const loadingStore = createStore<LoadingState>({ progress: 0, done: false })

const CHUNK_WEIGHT = 15

export const loadingActions = {
  /** The lazy 3D chunk arrived; three.js asset loading begins. */
  chunkLoaded: () =>
    loadingStore.setState((s) => ({ progress: Math.max(s.progress, CHUNK_WEIGHT) })),
  /** three.js DefaultLoadingManager progress (0..100). Never moves backwards. */
  assetsProgress: (assetPercent: number) =>
    loadingStore.setState((s) => ({
      progress: Math.max(s.progress, Math.min(99, CHUNK_WEIGHT + (assetPercent / 100) * (100 - CHUNK_WEIGHT))),
    })),
  complete: () => loadingStore.setState({ progress: 100, done: true }),
} as const

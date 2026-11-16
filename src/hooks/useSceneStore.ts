import { useSyncExternalStore } from 'react'
import { sceneStore, type SceneState } from '../store/sceneStore'

/** Subscribe to a slice of the scene store. Selectors must return stable values. */
export const useSceneStore = <T,>(selector: (state: SceneState) => T): T =>
  useSyncExternalStore(
    sceneStore.subscribe,
    () => selector(sceneStore.getState()),
    () => selector(sceneStore.getState()),
  )

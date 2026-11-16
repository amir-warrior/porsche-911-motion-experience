import { useSyncExternalStore } from 'react'
import { loadingStore, type LoadingState } from '../store/loadingStore'

export const useLoadingStore = <T,>(selector: (state: LoadingState) => T): T =>
  useSyncExternalStore(
    loadingStore.subscribe,
    () => selector(loadingStore.getState()),
    () => selector(loadingStore.getState()),
  )

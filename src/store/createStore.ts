type Listener = () => void

export interface Store<S> {
  getState: () => S
  setState: (patch: Partial<S> | ((state: S) => Partial<S>)) => void
  subscribe: (listener: Listener) => () => void
}

/**
 * Minimal immutable store compatible with React's useSyncExternalStore.
 * Every update produces a new state object; unchanged patches do not notify.
 */
export const createStore = <S extends object>(initial: S): Store<S> => {
  let state = initial
  const listeners = new Set<Listener>()

  const setState: Store<S>['setState'] = (patch) => {
    const partial = typeof patch === 'function' ? patch(state) : patch
    const changed = (Object.keys(partial) as (keyof S)[]).some((key) => !Object.is(partial[key], state[key]))
    if (!changed) return
    state = { ...state, ...partial }
    listeners.forEach((listener) => listener())
  }

  return {
    getState: () => state,
    setState,
    subscribe: (listener) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
  }
}

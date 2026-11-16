import { useSyncExternalStore } from 'react'

const getMatch = (query: string): boolean =>
  typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    ? window.matchMedia(query).matches
    : false

/** Reactive matchMedia subscription (SSR/test safe). */
export const useMediaQuery = (query: string): boolean =>
  useSyncExternalStore(
    (onChange) => {
      if (typeof window.matchMedia !== 'function') return () => undefined
      const mql = window.matchMedia(query)
      mql.addEventListener('change', onChange)
      return () => mql.removeEventListener('change', onChange)
    },
    () => getMatch(query),
    () => false,
  )

export const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'
export const FINE_POINTER_QUERY = '(hover: hover) and (pointer: fine)'

export const useReducedMotion = (): boolean => useMediaQuery(REDUCED_MOTION_QUERY)

export const prefersReducedMotion = (): boolean => getMatch(REDUCED_MOTION_QUERY)

import { gsap } from 'gsap'
import { useEffect, useRef, useState } from 'react'
import { FINE_POINTER_QUERY, useMediaQuery, useReducedMotion } from '../../hooks/useMediaQuery'

type CursorState = 'default' | 'hover' | 'view'

/**
 * Desktop-only custom cursor: a precise dot plus a lagging ring that reacts to
 * interactive elements via data-cursor. The native cursor stays visible, so
 * pointer accuracy and accessibility are never compromised.
 */
export const Cursor = () => {
  const enabled = useMediaQuery(FINE_POINTER_QUERY)
  const reduced = useReducedMotion()
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)
  const [state, setState] = useState<CursorState>('default')

  useEffect(() => {
    if (!enabled || reduced || !dot.current || !ring.current) return
    const dotX = gsap.quickTo(dot.current, 'x', { duration: 0.12, ease: 'power3' })
    const dotY = gsap.quickTo(dot.current, 'y', { duration: 0.12, ease: 'power3' })
    const ringX = gsap.quickTo(ring.current, 'x', { duration: 0.55, ease: 'power3' })
    const ringY = gsap.quickTo(ring.current, 'y', { duration: 0.55, ease: 'power3' })

    const onMove = (e: PointerEvent) => {
      dotX(e.clientX)
      dotY(e.clientY)
      ringX(e.clientX)
      ringY(e.clientY)
      const target = (e.target as Element | null)?.closest('[data-cursor], a, button')
      const kind = target?.getAttribute('data-cursor')
      setState(kind === 'view' ? 'view' : target ? 'hover' : 'default')
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [enabled, reduced])

  if (!enabled || reduced) return null

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[95] mix-blend-difference">
      <div ref={dot} className="absolute top-0 left-0 -mt-[3px] -ml-[3px] size-1.5 rounded-full bg-paper" />
      <div ref={ring} className="absolute top-0 left-0">
        <div
          className={[
            'grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-paper transition-[width,height,background-color] duration-500 ease-[var(--ease-out-expo)]',
            state === 'view' ? 'size-20 bg-paper' : state === 'hover' ? 'size-12' : 'size-8',
          ].join(' ')}
        >
          <span className={'type-label text-[9px] text-ink transition-opacity ' + (state === 'view' ? 'opacity-100' : 'opacity-0')}>View</span>
        </div>
      </div>
    </div>
  )
}

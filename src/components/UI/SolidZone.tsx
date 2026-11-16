import { useGSAP } from '@gsap/react'
import { useRef, type ReactNode } from 'react'
import { createSolidTrigger } from '../../animations/scroll/stageTriggers'

/**
 * Wraps consecutive opaque sections. While the zone fills the viewport the
 * 3D stage is hidden and its render loop paused (saves GPU and battery).
 */
export const SolidZone = ({ children }: { readonly children: ReactNode }) => {
  const zone = useRef<HTMLDivElement>(null)
  useGSAP(() => (zone.current ? createSolidTrigger(zone.current) : undefined), { scope: zone })
  return (
    <div ref={zone} className="relative z-10 bg-ink">
      {children}
    </div>
  )
}

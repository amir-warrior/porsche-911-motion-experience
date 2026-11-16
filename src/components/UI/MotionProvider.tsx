import { LazyMotion } from 'motion/react'
import type { ReactNode } from 'react'

const loadFeatures = () => import('./motionFeatures').then((mod) => mod.default)

/** LazyMotion boundary: components use `m.*`, features (incl. drag) load asynchronously. */
export const MotionProvider = ({ children }: { readonly children: ReactNode }) => (
  <LazyMotion features={loadFeatures} strict>
    {children}
  </LazyMotion>
)

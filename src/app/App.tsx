import { useEffect } from 'react'
import { startSmoothScroll } from '../animations/scroll/smoothScroll'
import { Cursor } from '../components/Cursor/Cursor'
import { Navigation } from '../components/Navigation/Navigation'
import { Preloader } from '../components/Preloader/Preloader'
import { MotionProvider } from '../components/UI/MotionProvider'
import { SolidZone } from '../components/UI/SolidZone'
import { useReducedMotion } from '../hooks/useMediaQuery'
import { Design } from '../sections/Design/Design'
import { Engineering } from '../sections/Engineering/Engineering'
import { Finale } from '../sections/Finale/Finale'
import { Footer } from '../sections/Footer/Footer'
import { Gallery } from '../sections/Gallery/Gallery'
import { Hero } from '../sections/Hero/Hero'
import { Journey } from '../sections/Journey/Journey'
import { Performance } from '../sections/Performance/Performance'
import { Studio } from '../sections/Studio/Studio'
import { StageLayer } from '../three/scenes/StageLayer'

export const App = () => {
  const reduced = useReducedMotion()

  // Smooth scroll only when motion is welcome; native scrolling otherwise.
  useEffect(() => (reduced ? undefined : startSmoothScroll()), [reduced])

  return (
    <MotionProvider>
      <a href="#main" className="type-label sr-only fixed top-4 left-4 z-[200] bg-paper px-4 py-3 text-ink focus:not-sr-only">
        Skip to content
      </a>
      <Preloader />
      <Cursor />
      <StageLayer />
      <Navigation />
      <main id="main">
        <Hero />
        <Journey />
        <Design />
        <SolidZone>
          <Engineering />
          <Performance />
        </SolidZone>
        <Studio />
        <SolidZone>
          <Gallery />
        </SolidZone>
        <Finale />
      </main>
      <Footer />
    </MotionProvider>
  )
}

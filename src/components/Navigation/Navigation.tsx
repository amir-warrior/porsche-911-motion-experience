import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Menu, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { lockScroll, scrollToTarget } from '../../animations/scroll/smoothScroll'
import { makeInert } from '../../utils/inert'
import { NAV_LINKS } from '../../data/site'
import { useReducedMotion } from '../../hooks/useMediaQuery'
import { useSceneStore } from '../../hooks/useSceneStore'

/** Fixed minimal navigation with section tracking, scroll progress and a mobile overlay. */
export const Navigation = () => {
  const root = useRef<HTMLElement>(null)
  const [active, setActive] = useState<string>('')
  const [menuOpen, setMenuOpen] = useState(false)
  const introDone = useSceneStore((s) => s.introDone)
  const exploring = useSceneStore((s) => s.mode === 'explore')
  const reduced = useReducedMotion()

  useGSAP(
    () => {
      if (!introDone) return
      // fromTo with explicit end values: the header also has a CSS opacity transition.
      if (!reduced)
        gsap.fromTo(
          '[data-nav-bar]',
          { yPercent: -100, autoAlpha: 0 },
          { yPercent: 0, autoAlpha: 1, duration: 1.2, ease: 'expo.out', delay: 1.4 },
        )
      gsap.to('[data-nav-progress]', {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: { start: 0, end: 'max', scrub: true },
      })
      NAV_LINKS.forEach(({ id }) => {
        ScrollTrigger.create({
          trigger: '#' + id,
          start: 'top center',
          end: 'bottom center',
          onToggle: (self) => self.isActive && setActive(id),
        })
      })
    },
    { dependencies: [introDone, reduced] },
  )

  // Mobile menu behaves like a dialog: scroll locked, page behind inert, Esc closes.
  useEffect(() => {
    if (!menuOpen) return
    const unlock = lockScroll()
    const unInert = makeInert(['#main', 'footer'])
    document.querySelector<HTMLElement>('#mobile-menu a')?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      unInert()
      unlock()
    }
  }, [menuOpen])

  const go = (id: string) => {
    setMenuOpen(false)
    // Wait one frame so the menu's scroll lock is released before gliding.
    requestAnimationFrame(() => scrollToTarget('#' + id))
  }

  return (
    <header
      ref={root}
      className={'fixed inset-x-0 top-0 z-50 transition-opacity duration-500 ' + (exploring ? 'pointer-events-none opacity-0' : '')}
    >
      <nav data-nav-bar aria-label="Main" className="flex items-center justify-between px-gutter py-5 md:py-6">
        <a href="#top" onClick={(e) => (e.preventDefault(), scrollToTarget(0))} className="type-label flex items-center gap-3 text-paper" data-cursor="hover">
          <span className="type-headline text-lg tracking-tight">911</span>
          <span className="hidden text-mute sm:inline">Beyond Limits</span>
        </a>
        <ul className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.id}>
              <a
                href={'#' + link.id}
                onClick={(e) => (e.preventDefault(), go(link.id))}
                aria-current={active === link.id ? 'true' : undefined}
                data-cursor="hover"
                className={'type-label relative py-1 transition-colors ' + (active === link.id ? 'text-paper' : 'text-mute hover:text-paper')}
              >
                {link.label}
                <span aria-hidden="true" className={'absolute -bottom-1 left-0 h-px bg-accent transition-all duration-500 ' + (active === link.id ? 'w-full' : 'w-0')} />
              </a>
            </li>
          ))}
        </ul>
        <p className="type-label hidden text-mute lg:block">Unofficial study</p>
        <button
          type="button"
          className="grid size-10 place-items-center border border-line lg:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMenuOpen((o) => !o)}
        >
          {menuOpen ? <X className="size-4" aria-hidden="true" /> : <Menu className="size-4" aria-hidden="true" />}
        </button>
      </nav>
      <div aria-hidden="true" className="h-px w-full bg-line">
        <div data-nav-progress className="h-full origin-left scale-x-0 bg-paper/60" />
      </div>
      <div
        id="mobile-menu"
        hidden={!menuOpen}
        className="fixed inset-0 top-[4.6rem] z-40 bg-ink px-gutter py-10 lg:hidden"
      >
        <ul className="space-y-1">
          {NAV_LINKS.map((link, i) => (
            <li key={link.id} className="border-b border-line">
              <a href={'#' + link.id} onClick={(e) => (e.preventDefault(), go(link.id))} className="flex items-baseline justify-between py-4">
                <span className="type-headline text-4xl">{link.label}</span>
                <span className="type-label text-mute">{String(i + 2).padStart(2, '0')}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  )
}

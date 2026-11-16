import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { AnimatePresence, m } from 'motion/react'
import { useEffect, useRef, type CSSProperties } from 'react'
import { setScrollLocked } from '../../animations/scroll/smoothScroll'
import type { GalleryItem } from '../../data/gallery'
import { RenderImage } from './RenderImage'

interface LightboxProps {
  readonly items: readonly GalleryItem[]
  readonly index: number | null
  readonly onClose: () => void
  readonly onNavigate: (index: number) => void
  readonly reduced: boolean
}

const SWIPE_PX = 60

/** Fullscreen viewer: Esc / arrows / swipe, focus moved into the dialog and restored on close. */
export const Lightbox = ({ items, index, onClose, onNavigate, reduced }: LightboxProps) => {
  const closeBtn = useRef<HTMLButtonElement>(null)
  const open = index !== null
  const item = open ? items[index] : undefined
  const step = (delta: number) => {
    if (index === null) return
    onNavigate((index + delta + items.length) % items.length)
  }

  useEffect(() => {
    if (!open) return
    const previous = document.activeElement as HTMLElement | null
    setScrollLocked(true)
    closeBtn.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') step(1)
      if (e.key === 'ArrowLeft') step(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      setScrollLocked(false)
      previous?.focus()
    }
    // step depends on index, which is part of the effect identity below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, index])

  return (
    <AnimatePresence>
      {item && index !== null ? (
        <m.div
          role="dialog"
          aria-modal="true"
          aria-label={'Render ' + (index + 1) + ' of ' + items.length + ': ' + item.caption}
          className="fixed inset-0 z-[90] flex flex-col bg-ink/95 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0 : 0.4 }}
        >
          <div className="flex items-center justify-between px-gutter py-5">
            <p className="type-label text-mute">
              <span className="text-paper">{String(index + 1).padStart(2, '0')}</span> / {String(items.length).padStart(2, '0')} · {item.caption}
            </p>
            <button ref={closeBtn} type="button" onClick={onClose} aria-label="Close viewer" className="grid size-10 place-items-center border border-line transition-colors hover:bg-paper hover:text-ink">
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>
          <div className="relative flex flex-1 items-center justify-center overflow-hidden px-gutter pb-6">
            <AnimatePresence mode="wait" initial={false}>
              <m.div
                key={item.id}
                className="max-h-full w-full max-w-[min(100%,calc((100svh-9rem)*var(--ar)))]"
                style={{ '--ar': String(item.width / item.height) } as CSSProperties}
                initial={reduced ? false : { clipPath: 'inset(0% 0% 0% 100%)', opacity: 0.4 }}
                animate={{ clipPath: 'inset(0% 0% 0% 0%)', opacity: 1 }}
                exit={reduced ? { opacity: 0 } : { clipPath: 'inset(0% 100% 0% 0%)', opacity: 0.4 }}
                transition={{ duration: 0.7, ease: [0.77, 0, 0.175, 1] }}
                drag={reduced ? false : 'x'}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -SWIPE_PX) step(1)
                  else if (info.offset.x > SWIPE_PX) step(-1)
                }}
              >
                <RenderImage item={item} sizes="100vw" eager className="h-auto w-full select-none" />
              </m.div>
            </AnimatePresence>
            <button type="button" onClick={() => step(-1)} aria-label="Previous render" className="absolute top-1/2 left-[var(--gutter)] hidden size-12 -translate-y-1/2 place-items-center border border-line bg-ink/60 hover:bg-paper hover:text-ink md:grid">
              <ChevronLeft className="size-5" aria-hidden="true" />
            </button>
            <button type="button" onClick={() => step(1)} aria-label="Next render" className="absolute top-1/2 right-[var(--gutter)] hidden size-12 -translate-y-1/2 place-items-center border border-line bg-ink/60 hover:bg-paper hover:text-ink md:grid">
              <ChevronRight className="size-5" aria-hidden="true" />
            </button>
          </div>
        </m.div>
      ) : null}
    </AnimatePresence>
  )
}

import { X } from 'lucide-react'
import { sceneActions } from '../../store/sceneStore'

/** Floating control bar shown while the visitor drives the camera. */
export const ExploreHint = () => (
  <div className="pointer-events-none fixed inset-x-0 bottom-8 z-40 flex justify-center px-gutter">
    <div className="pointer-events-auto flex items-center gap-4 border border-line bg-ink/80 py-2 pr-2 pl-4 backdrop-blur-md">
      <p className="type-label text-mute">Drag to orbit · scroll or pinch to zoom · Esc to exit</p>
      <button
        type="button"
        autoFocus
        onClick={sceneActions.exitExplore}
        className="type-label flex items-center gap-2 border border-line-strong px-3 py-2 transition-colors hover:bg-paper hover:text-ink"
      >
        <X className="size-3.5" aria-hidden="true" /> Exit
      </button>
    </div>
  </div>
)

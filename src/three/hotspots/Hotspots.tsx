import { Html } from '@react-three/drei'
import { HOTSPOTS } from '../../data/hotspots'
import { useSceneStore } from '../../hooks/useSceneStore'
import { sceneActions } from '../../store/sceneStore'

/**
 * Hotspots are anchored to points on the model and rendered as real DOM buttons,
 * so they are focusable and announced by screen readers.
 */
export const Hotspots = () => {
  const visible = useSceneStore((s) => s.hotspotsVisible)
  const active = useSceneStore((s) => s.activeHotspot)
  if (!visible) return null

  return (
    <group>
      {HOTSPOTS.map((spot, i) => {
        const isActive = active === spot.id
        const dimmed = active !== null && !isActive
        return (
          <Html key={spot.id} position={[...spot.anchor]} center zIndexRange={[30, 0]}>
            <button
              type="button"
              aria-pressed={isActive}
              aria-label={spot.label}
              onClick={() => sceneActions.focusHotspot(isActive ? null : spot.id)}
              className={[
                'group pointer-events-auto relative grid size-9 place-items-center rounded-full border transition-all duration-500',
                'border-paper/60 bg-ink/40 backdrop-blur-sm hover:border-paper hover:bg-paper hover:text-ink',
                isActive ? 'scale-110 border-accent bg-accent text-paper' : 'text-paper',
                dimmed ? 'opacity-30' : 'opacity-100',
              ].join(' ')}
            >
              <span className="absolute inset-0 animate-ping rounded-full border border-paper/30 [animation-duration:2.4s] group-aria-pressed:hidden" />
              <span className="font-mono text-[10px] tracking-wider">{String(i + 1).padStart(2, '0')}</span>
            </button>
          </Html>
        )
      })}
    </group>
  )
}

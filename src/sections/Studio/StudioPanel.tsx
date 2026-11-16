import { Camera, Move3d } from 'lucide-react'
import { CtaButton } from '../../components/UI/CtaButton'
import { ENVIRONMENT_ORDER, ENVIRONMENTS } from '../../data/environments'
import { findPaint, findWheel, PAINTS, WHEEL_FINISHES } from '../../data/paints'
import { STUDIO_PRESETS } from '../../data/shots'
import { useSceneStore } from '../../hooks/useSceneStore'
import { sceneActions } from '../../store/sceneStore'
import { Chip, OptionGroup, Swatch } from './OptionGroup'
import { usePhotoMode } from './usePhotoMode'

const CAPTURE_LABEL = { idle: 'Capture', busy: 'Rendering', saved: 'Saved', error: 'Retry' } as const

/** Configurator controls. Every option updates the live renderer. */
export const StudioPanel = () => {
  const environment = useSceneStore((s) => s.environment)
  const paintId = useSceneStore((s) => s.paintId)
  const wheelId = useSceneStore((s) => s.wheelId)
  const preset = useSceneStore((s) => s.presetShot)
  const webglReady = useSceneStore((s) => s.webgl === 'ready')
  const { status, capture } = usePhotoMode()
  const env = ENVIRONMENTS[environment]

  return (
    <div data-reveal className="w-full space-y-5 border border-line bg-ink/75 p-5 backdrop-blur-md md:ml-auto md:max-w-sm">
      <OptionGroup legend="Lighting" value={env.label}>
        {ENVIRONMENT_ORDER.map((id) => (
          <Chip key={id} active={id === environment} onSelect={() => sceneActions.setEnvironment(id)}>
            {ENVIRONMENTS[id].label}
          </Chip>
        ))}
      </OptionGroup>
      <p className="-mt-2 text-xs leading-relaxed text-mute">{env.description}</p>

      <OptionGroup legend="Paint" value={findPaint(paintId).name}>
        {PAINTS.map((p) => (
          <Swatch key={p.id} color={p.color} name={p.name} active={p.id === paintId} onSelect={() => sceneActions.setPaint(p.id)} />
        ))}
      </OptionGroup>

      <OptionGroup legend="Wheels" value={findWheel(wheelId).name}>
        {WHEEL_FINISHES.map((w) => (
          <Chip key={w.id} active={w.id === wheelId} onSelect={() => sceneActions.setWheel(w.id)}>
            {w.name}
          </Chip>
        ))}
      </OptionGroup>

      <OptionGroup legend="Camera">
        {STUDIO_PRESETS.map((p) => (
          <Chip key={p.id} active={(preset ?? 'studio') === p.id} onSelect={() => sceneActions.setPreset(p.id)}>
            {p.label}
          </Chip>
        ))}
      </OptionGroup>

      <div className="grid grid-cols-2 gap-2 pt-1">
        <CtaButton
          data-free-cam
          className="justify-center px-3"
          onClick={sceneActions.enterExplore}
          disabled={!webglReady}
          icon={<Move3d className="size-4" aria-hidden="true" />}
        >
          Free cam
        </CtaButton>
        <CtaButton
          variant="solid"
          className="justify-center px-3"
          onClick={capture}
          disabled={!webglReady || status === 'busy'}
          aria-label="Capture photo of the current view"
          icon={<Camera className="size-4" aria-hidden="true" />}
        >
          {CAPTURE_LABEL[status]}
        </CtaButton>
      </div>
      <p className="type-label text-[10px] text-mute" aria-live="polite">
        {status === 'saved' ? 'PNG saved to your downloads' : 'Visual concept · not an official factory configuration'}
      </p>
    </div>
  )
}

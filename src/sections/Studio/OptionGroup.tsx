import type { ReactNode } from 'react'

interface OptionGroupProps {
  readonly legend: string
  readonly value?: string
  readonly children: ReactNode
}

/** Fieldset wrapper giving each control group an accessible legend and current value. */
export const OptionGroup = ({ legend, value, children }: OptionGroupProps) => (
  <fieldset className="border-t border-line pt-3">
    <legend className="type-label flex w-full justify-between text-mute">
      <span>{legend}</span>
      {value ? <span className="text-paper">{value}</span> : null}
    </legend>
    <div className="mt-3 flex flex-wrap gap-2">{children}</div>
  </fieldset>
)

interface ChipProps {
  readonly active: boolean
  readonly onSelect: () => void
  readonly children: ReactNode
  readonly label?: string
}

export const Chip = ({ active, onSelect, children, label }: ChipProps) => (
  <button
    type="button"
    aria-pressed={active}
    aria-label={label}
    data-cursor="hover"
    onClick={onSelect}
    className={[
      'type-label border px-3 py-2 transition-colors duration-300',
      active ? 'border-paper bg-paper text-ink' : 'border-line text-mute hover:border-line-strong hover:text-paper',
    ].join(' ')}
  >
    {children}
  </button>
)

interface SwatchProps {
  readonly color: string
  readonly name: string
  readonly active: boolean
  readonly onSelect: () => void
}

export const Swatch = ({ color, name, active, onSelect }: SwatchProps) => (
  <button
    type="button"
    aria-pressed={active}
    aria-label={name}
    title={name}
    data-cursor="hover"
    onClick={onSelect}
    className={[
      'relative size-9 border transition-transform duration-300 hover:scale-105',
      active ? 'border-paper' : 'border-line',
    ].join(' ')}
  >
    <span className="absolute inset-1" style={{ background: 'linear-gradient(135deg, ' + color + ' 40%, rgba(255,255,255,0.35) 52%, ' + color + ' 64%)' }} />
    {active ? <span aria-hidden="true" className="absolute -bottom-2 left-1/2 h-px w-4 -translate-x-1/2 bg-accent" /> : null}
  </button>
)

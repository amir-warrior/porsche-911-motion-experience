import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface CtaButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  readonly children: ReactNode
  readonly variant?: 'solid' | 'ghost'
  readonly icon?: ReactNode
}

/**
 * Rectangular CTA with a wipe fill on hover and a sliding label —
 * deliberate sharp corners to match the automotive editorial language.
 */
export const CtaButton = ({ children, variant = 'ghost', icon, className = '', ...rest }: CtaButtonProps) => (
  <button
    type="button"
    data-cursor="hover"
    className={[
      'group relative inline-flex items-center gap-4 overflow-hidden border px-6 py-4',
      'type-label transition-colors duration-500 ease-[var(--ease-out-expo)] disabled:opacity-40',
      variant === 'solid' ? 'border-paper bg-paper text-ink hover:text-paper' : 'border-line-strong text-paper hover:text-ink',
      className,
    ].join(' ')}
    {...rest}
  >
    <span
      aria-hidden="true"
      className={[
        'absolute inset-0 origin-bottom scale-y-0 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-y-100',
        variant === 'solid' ? 'bg-accent' : 'bg-paper',
      ].join(' ')}
    />
    <span className="relative block overflow-hidden">
      <span className="block transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:-translate-y-full">
        {children}
      </span>
      <span aria-hidden="true" className="absolute inset-0 block translate-y-full transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-y-0">
        {children}
      </span>
    </span>
    {icon ? <span className="relative transition-transform duration-500 group-hover:translate-x-1">{icon}</span> : null}
  </button>
)

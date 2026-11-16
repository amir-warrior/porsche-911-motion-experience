interface SectionLabelProps {
  readonly index: string
  readonly children: string
  readonly className?: string
}

/** Technical chapter marker: index, hairline, label. */
export const SectionLabel = ({ index, children, className = '' }: SectionLabelProps) => (
  <p data-reveal className={'type-label flex items-center gap-3 text-mute ' + className}>
    <span className="text-paper">{index}</span>
    <span aria-hidden="true" className="h-px w-10 bg-line-strong" />
    <span>{children}</span>
  </p>
)

import type { ElementType } from 'react'

interface SplitWordsProps {
  readonly text: string
  readonly as?: ElementType
  readonly className?: string
  readonly id?: string
}

/**
 * Renders text as masked words for staggered reveals. The full string stays
 * available to assistive tech via aria-label; the pieces are aria-hidden.
 * Animate `[data-split-word]` (e.g. yPercent 110 → 0).
 */
export const SplitWords = ({ text, as: Tag = 'span', className, id }: SplitWordsProps) => {
  const lines = text.split('\n')
  return (
    <Tag className={className} aria-label={text.replace(/\n/g, ' ')} id={id}>
      {lines.map((line, li) => (
        <span key={li} aria-hidden="true" className="block">
          {line.split(' ').map((word, wi) => (
            <span key={wi} className="split-line inline-block align-top">
              <span data-split-word className="inline-block will-change-transform">
                {word}
                {wi < line.split(' ').length - 1 ? ' ' : ''}
              </span>
            </span>
          ))}
        </span>
      ))}
    </Tag>
  )
}

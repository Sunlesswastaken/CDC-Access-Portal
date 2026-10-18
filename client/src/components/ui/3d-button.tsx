import type { ButtonHTMLAttributes, CSSProperties } from 'react'
import { cn } from '@/lib/utils'

/**
 * Animated call-to-action button.
 *
 * Adapted from the 21st.dev "3D button". The upstream component ships only its
 * `@keyframes`, so the base styles live in the `morph-btn` section of
 * `src/index.css`. This is the flat variant: no drop shadow, no 3D rotation.
 *
 * The label morphs into `hoverLabel` (which defaults to `label`, giving a
 * character re-roll when no second label is supplied).
 */
type MorphButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  /** Text shown at rest. */
  label?: string
  /** Text the label morphs into on hover/focus. Defaults to `label`. */
  hoverLabel?: string
}

function Chars({ text, state }: { text: string; state: 1 | 2 }) {
  return (
    <span className={cn('chars', `state-${state}`)} aria-hidden={state === 2}>
      {Array.from(text).map((char, index) => (
        <span
          key={`${state}-${index}`}
          className="c"
          style={{ '--i': index + 1 } as CSSProperties}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  )
}

export function Component({
  label = 'Join Today',
  hoverLabel = label,
  className,
  ...props
}: MorphButtonProps) {
  return (
    <button type="button" className={cn('morph-btn', className)} {...props}>
      <span className="wrap">
        <span className="content">
          <Chars text={label} state={1} />
          <Chars text={hoverLabel} state={2} />
        </span>
      </span>
    </button>
  )
}

export default Component

import { cva } from 'class-variance-authority'
import type { ComponentProps } from 'react'
import { cn } from '../core/cn'
import { Icon } from '../core/Icon'
import { useLocale } from '../core/locale'

export type ChipTone = 'neutral' | 'blue' | 'violet' | 'good' | 'warn' | 'pink' | 'ink'

/* An icon in a chip is 14px. Its strokes do not fill its box, so at the start it sits 2px closer to the edge and to the text. */
const chip = cva(
  'gx-chip inline-flex h-[1.5rem] flex-none items-center gap-1.5 rounded-md px-2 text-xs font-control whitespace-nowrap [&>svg]:size-[14px] [&>svg]:flex-none [&>svg:first-child]:-mx-0.5',
  {
    variants: {
      tone: {
        /* A plain fact has an outline, not a grey fill: fills are for facts with a meaning. */
        neutral: 'gx-chip--neutral text-ink-soft shadow-edge-strong',
        blue: 'gx-chip--blue bg-blue-soft text-blue',
        violet: 'gx-chip--violet bg-violet-soft text-violet',
        good: 'gx-chip--good bg-good-soft text-good',
        warn: 'gx-chip--warn bg-warn-soft text-warn',
        pink: 'gx-chip--pink bg-pink-soft text-pink',
        ink: 'gx-chip--ink bg-ink text-white',
      },
      /*
       * The remove button is 20px, so the chip stays 24px high. The chip's end padding and the button's start margin shrink,
       * so the cross has the same 8px on both sides that the text has at the start.
       */
      removable: { true: 'gx-chip--removable pe-[calc(var(--gx-space-0-5)+0.5px)]' },
    },
  },
)

/**
 * Small rounded label: standard codes, skill names, statuses. With `onRemove` it ends with a remove button:
 * an attached file, a picked skill. `removeLabel` names that button ("Remove worksheet.pdf").
 */
export function Chip({
  tone = 'neutral',
  onRemove,
  removeLabel,
  className,
  children,
  ...props
}: ComponentProps<'span'> & { tone?: ChipTone; onRemove?: () => void; removeLabel?: string }) {
  const { messages } = useLocale()
  return (
    <span className={cn(chip({ tone, removable: Boolean(onRemove) }), className)} {...props}>
      {children}
      {onRemove ? (
        <button
          type="button"
          aria-label={removeLabel ?? messages.remove}
          onClick={onRemove}
          /* The ring is inside the button: outside, it would lie on the last letter of the text. On the ink chip it is white: blue on ink is under 3:1. */
          className={cn(
            'gx-chip__remove -ms-1 grid size-[20px] flex-none place-items-center rounded-sm cursor-pointer outline-0 transition-[background-color] duration-(--gx-dur-fast) ease-standard hover:bg-[color-mix(in_srgb,currentColor_12%,transparent)] focus-visible:focus-ring focus-visible:-outline-offset-2',
            tone === 'ink' && 'focus-visible:outline-white',
          )}
        >
          <Icon name="close" size={14} />
        </button>
      ) : null}
    </span>
  )
}

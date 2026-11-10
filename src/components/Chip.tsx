import type { ComponentProps } from 'react'
import { cx } from '../core/cx'
import { Icon } from '../core/Icon'
import { useLocale } from '../core/locale'

export type ChipTone = 'neutral' | 'blue' | 'violet' | 'good' | 'warn' | 'pink' | 'ink'

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
    <span className={cx('gx-chip', `gx-chip--${tone}`, onRemove && 'gx-chip--removable', className)} {...props}>
      {children}
      {onRemove ? (
        <button type="button" aria-label={removeLabel ?? messages.remove} onClick={onRemove} className="gx-chip__remove">
          <Icon name="close" size={14} />
        </button>
      ) : null}
    </span>
  )
}

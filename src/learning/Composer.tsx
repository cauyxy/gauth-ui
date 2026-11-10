import { useLayoutEffect, useRef, type KeyboardEvent, type ReactNode } from 'react'
import { cx } from '../core/cx'
import { Icon } from '../core/Icon'
import { useLocale } from '../core/locale'

/**
 * Where a person writes to Gauth AI. Enter sends and Shift+Enter makes a new line. The box grows with the text, to
 * about six lines. `label` is the accessible name of the text box. The page keeps `value` and empties it in `onSend`.
 * The line under the box is always there: `note` replaces its words.
 */
export function Composer({
  value,
  onChange,
  onSend,
  label,
  placeholder,
  note,
  disabled = false,
  className,
}: {
  value: string
  onChange: (value: string) => void
  onSend: (value: string) => void
  label: string
  placeholder?: string
  note?: ReactNode
  disabled?: boolean
  className?: string
}) {
  const { messages } = useLocale()
  const input = useRef<HTMLTextAreaElement>(null)
  const empty = value.trim() === ''

  useLayoutEffect(() => {
    const el = input.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }, [value])

  const send = () => {
    if (!empty && !disabled) onSend(value)
  }
  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== 'Enter' || event.shiftKey || event.nativeEvent.isComposing) return
    event.preventDefault()
    send()
  }

  return (
    <div className={cx('gx-composer', className)}>
      <div className="gx-composer__box">
        <textarea
          ref={input}
          rows={1}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={onKeyDown}
          aria-label={label}
          placeholder={placeholder}
          disabled={disabled}
          className="gx-composer__input"
        />
        <button type="button" aria-label={messages.send} disabled={disabled || empty} onClick={send} className="gx-composer__send">
          <Icon name="arrow-up" size={18} />
        </button>
      </div>
      <p className="gx-composer__note">{note ?? messages.aiNote}</p>
    </div>
  )
}

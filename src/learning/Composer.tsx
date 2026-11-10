import { useLayoutEffect, useRef, type KeyboardEvent, type ReactNode } from 'react'
import { cx } from '../core/cx'
import { Icon } from '../core/Icon'
import { useLocale } from '../core/locale'

/**
 * Where a person writes to Gauth AI. Enter sends and Shift+Enter makes a new line. The box grows with the text, to
 * about six lines. `label` is the accessible name of the text box. The page keeps `value` and empties it in `onSend`.
 * The line under the box is always there: `note` replaces its words.
 *
 * `before` is rows inside the box above the text (a `Quote`, attachment chips). `tools` is buttons at the start of a
 * bottom row (attach, microphone); with them the box has two rows. While `busy`, Send is Stop: it calls `onStop`, and
 * Enter does not send. The person can still write the next message.
 */
export function Composer({
  value,
  onChange,
  onSend,
  label,
  placeholder,
  note,
  before,
  tools,
  busy = false,
  onStop,
  disabled = false,
  className,
}: {
  value: string
  onChange: (value: string) => void
  onSend: (value: string) => void
  label: string
  placeholder?: string
  note?: ReactNode
  before?: ReactNode
  tools?: ReactNode
  busy?: boolean
  onStop?: () => void
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
    if (!empty && !disabled && !busy) onSend(value)
  }
  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== 'Enter' || event.shiftKey || event.nativeEvent.isComposing) return
    event.preventDefault()
    send()
  }

  return (
    <div className={cx('gx-composer', className)}>
      <div className={cx('gx-composer__box', tools ? 'gx-composer__box--tools' : null)}>
        {before ? <div className="gx-composer__before">{before}</div> : null}
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
        {tools ? <div className="gx-composer__tools">{tools}</div> : null}
        {/* One button for both, so keyboard focus stays on it when Gauth AI starts and ends. */}
        <button
          type="button"
          aria-label={busy ? messages.stop : messages.send}
          disabled={busy ? !onStop : disabled || empty}
          onClick={() => (busy ? onStop?.() : send())}
          className="gx-composer__send"
        >
          {busy ? <Icon name="stop" size={14} fill="currentColor" /> : <Icon name="arrow-up" size={18} />}
        </button>
      </div>
      <p className="gx-composer__note">{note ?? messages.aiNote}</p>
    </div>
  )
}

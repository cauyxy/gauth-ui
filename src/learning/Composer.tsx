import { useLayoutEffect, useRef, type KeyboardEvent, type ReactNode } from 'react'
import { cn } from '../core/cn'
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

  /* The height follows the text, so the effect runs again on each new value although it does not read it. */
  useLayoutEffect(() => {
    const el = input.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = el.scrollHeight + 'px'
    // oxlint-disable-next-line react/exhaustive-effect-dependencies
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
    <div className={cn('gx-composer flex w-full flex-col gap-2', className)}>
      {/* Two columns: the text, then Send at the bottom end. With tools the text takes both and the tools stand beside Send. The ring goes around the box while the person writes; a button in the box shows its own. */}
      <div
        className={cn(
          'gx-composer__box grid grid-cols-[minmax(0,1fr)_auto] items-end gap-x-2.5 gap-y-2 rounded-2xl bg-white py-3 pr-3 pl-4 shadow-edge-strong has-[>textarea:focus-visible]:focus-ring has-[>textarea:focus-visible]:outline-offset-1',
          tools ? 'gx-composer__box--tools' : null,
        )}
      >
        {/* Rows above the text keep to the box's own padding. */}
        {before ? <div className="gx-composer__before col-span-full flex min-w-0 flex-col gap-2 empty:hidden">{before}</div> : null}
        <textarea
          ref={input}
          rows={1}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={onKeyDown}
          aria-label={label}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            'gx-composer__input block max-h-[calc(6em_*_var(--gx-leading-body)_+_var(--gx-space-3))] w-full min-w-0 resize-none py-1.5 text-base leading-body text-ink outline-0 placeholder:text-muted',
            tools ? 'col-span-full' : null,
          )}
        />
        {/* A ghost icon button holds its icon 8px in, so the row moves 8px toward the start: the first icon is then under the text's edge. */}
        {tools ? (
          <div className="gx-composer__tools flex min-w-0 flex-wrap items-center gap-1 self-center has-[>.gx-icon-btn--ghost:first-child]:-ms-2">{tools}</div>
        ) : null}
        {/* One button for both, so keyboard focus stays on it when Gauth AI starts and ends. */}
        <button
          type="button"
          aria-label={busy ? messages.stop : messages.send}
          disabled={busy ? !onStop : disabled || empty}
          onClick={() => (busy ? onStop?.() : send())}
          className="gx-composer__send my-px grid size-(--gx-h-md) flex-none cursor-pointer place-items-center rounded-full bg-ink text-white outline-0 transition-[background-color] duration-(--gx-dur-fast) ease-standard hover:bg-black focus-visible:focus-ring focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50"
        >
          {busy ? <Icon name="stop" size={14} fill="currentColor" /> : <Icon name="arrow-up" size={18} />}
        </button>
      </div>
      <p className="gx-composer__note text-center text-2xs text-muted">{note ?? messages.aiNote}</p>
    </div>
  )
}

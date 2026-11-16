'use client'

import { useLayoutEffect, useMemo, useRef, type KeyboardEvent, type ReactNode } from 'react'
import { cn } from '../core/cn'
import { Icon } from '../core/Icon'
import { useLocale } from '../core/locale'
import type { Props } from '../core/props'
import { mergeRefs } from '../core/refs'
import { useControllable } from '../core/useControllable'

export type ComposerProps = Props<
  'textarea',
  {
    value?: string
    defaultValue?: string
    onChange?: (value: string) => void
    onSend: (value: string) => void
    label: string
    note?: ReactNode
    before?: ReactNode
    tools?: ReactNode
    busy?: boolean
    onStop?: () => void
  },
  'children' | 'rows'
>

/**
 * Where a person writes to Gauth AI. Enter sends and Shift+Enter makes a new line. The box grows with the text, to
 * about six lines. `label` is the accessible name of the text box. With `value` the page keeps the text and empties it
 * in `onSend`; without it the composer keeps the text and empties it after `onSend`.
 * The line under the box is always there: `note` replaces its words.
 * `className` goes to the root, every other prop (`placeholder`, `maxLength`, `onPaste`) and `ref` to the `<textarea>`.
 *
 * `before` is rows inside the box above the text (a `Quote`, attachment chips). `tools` is buttons at the start of a
 * bottom row (attach, microphone); with them the box has two rows. While `busy`, Send is Stop: it calls `onStop`, and
 * Enter does not send. The person can still write the next message.
 */
export function Composer({
  value: kept,
  defaultValue = '',
  onChange,
  onSend,
  label,
  note,
  before,
  tools,
  busy = false,
  onStop,
  disabled = false,
  className,
  onKeyDown,
  ref,
  ...props
}: ComposerProps) {
  const { messages } = useLocale()
  const [value, set, controlled] = useControllable(kept, defaultValue, onChange)
  const input = useRef<HTMLTextAreaElement>(null)
  const setInput = useMemo(() => mergeRefs(input, ref), [ref])
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
    if (empty || disabled || busy) return
    onSend(value)
    if (!controlled) set('')
  }
  const onKey = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    onKeyDown?.(event)
    if (event.defaultPrevented) return
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
          aria-label={label}
          {...props}
          ref={setInput}
          rows={1}
          value={value}
          onChange={(event) => set(event.target.value)}
          onKeyDown={onKey}
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

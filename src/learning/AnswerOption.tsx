import { Children, createContext, isValidElement, useContext, type KeyboardEvent, type ReactNode } from 'react'
import { cx } from '../core/cx'
import { Icon } from '../core/Icon'
import { useLocale } from '../core/locale'

/** What an answered option says: `right` is "Correct", `retry` is "Not yet". There is no wrong. */
export type AnswerState = 'right' | 'retry'

type Group = { value: string | null; tabStop: string | null; onChange: (value: string) => void; disabled: boolean }
const GroupContext = createContext<Group>({ value: null, tabStop: null, onChange: () => {}, disabled: false })

/**
 * The options of one question. `label` is its accessible name (the question, or "Answers").
 * Tab moves to the picked option, or to the first when none is picked; the arrow keys, Home and End move the pick.
 * The options are its direct children. `disabled` locks the pick, for a question that is answered.
 */
export function AnswerGroup({
  label,
  value,
  onChange,
  disabled = false,
  children,
  className,
}: {
  label: string
  value: string | null
  onChange: (value: string) => void
  disabled?: boolean
  children: ReactNode
  className?: string
}) {
  const [first] = Children.toArray(children)
  const tabStop = value ?? (isValidElement<{ value?: string }>(first) ? (first.props.value ?? null) : null)
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const options = [...event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="radio"]')]
    const from = options.indexOf(event.target as HTMLButtonElement)
    const last = options.length - 1
    if (from < 0) return
    const to =
      event.key === 'ArrowRight' || event.key === 'ArrowDown'
        ? from === last ? 0 : from + 1
        : event.key === 'ArrowLeft' || event.key === 'ArrowUp'
          ? from === 0 ? last : from - 1
          : event.key === 'Home'
            ? 0
            : event.key === 'End'
              ? last
              : -1
    if (to < 0) return
    event.preventDefault()
    onChange(options[to]!.value)
    options[to]!.focus()
  }
  return (
    <div role="radiogroup" aria-label={label} aria-disabled={disabled || undefined} onKeyDown={onKeyDown} className={cx('gx-answer-group', className)}>
      <GroupContext.Provider value={{ value, tabStop, onChange, disabled }}>{children}</GroupContext.Provider>
    </div>
  )
}

/**
 * One option of an AnswerGroup: a letter mark, then the content (text, a formula, a figure).
 * `state` is the feedback after an answer; it adds the word "Correct" or "Not yet" at the end of the row.
 */
export function AnswerOption({
  value,
  letter,
  state,
  children,
  className,
}: {
  value: string
  letter?: string
  state?: AnswerState
  children: ReactNode
  className?: string
}) {
  const group = useContext(GroupContext)
  const { messages } = useLocale()
  return (
    <button
      type="button"
      role="radio"
      aria-checked={group.value === value}
      value={value}
      data-state={state}
      tabIndex={group.tabStop === value ? 0 : -1}
      disabled={group.disabled}
      onClick={() => group.onChange(value)}
      className={cx('gx-answer-option', className)}
    >
      <span className="gx-answer-option__mark">{state === 'right' ? <Icon name="check" size={16} /> : letter}</span>
      <span className="gx-answer-option__content">{children}</span>
      {state ? <span className="gx-answer-option__word">{state === 'right' ? messages.correct : messages.notYet}</span> : null}
    </button>
  )
}

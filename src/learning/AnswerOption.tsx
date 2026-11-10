import { Children, createContext, isValidElement, useContext, type KeyboardEvent, type ReactNode } from 'react'
import { cn } from '../core/cn'
import { Icon } from '../core/Icon'
import { useLocale } from '../core/locale'

/** What an answered option says: `right` is "Correct", `retry` is "Not yet". There is no wrong. */
export type AnswerState = 'right' | 'retry'

type Group = { value: string | null; tabStop: string | null; onChange: (value: string) => void; disabled: boolean }
const GroupContext = createContext<Group>({ value: null, tabStop: null, onChange: () => {}, disabled: false })

/*
 * The states of an option are attributes, and two can be true at once, so each class says the whole case it is for.
 * A locked option keeps its full color: an answered question must stay easy to read.
 * Picked: the row stays white. Its outline and its ink mark say it is the pick.
 * Answered: the ground, the mark and the word each say the state; the letter or check on a fill is ink, never white.
 */
const option = cn(
  'gx-answer-option group/option flex min-h-(--gx-h-xl) w-full cursor-pointer items-center gap-3.5 rounded-2xl bg-white px-4 py-2 text-start text-lg leading-heading text-ink shadow-edge-strong outline-0 transition-[background-color,box-shadow] duration-(--gx-dur-base) ease-standard',
  'focus-visible:focus-ring focus-visible:outline-offset-2 disabled:cursor-default',
  'enabled:not-aria-checked:not-data-[state]:hover:bg-surface',
  /* Answered, the edge is transparent and not `shadow-none`: that one is not inset, so the outline would jump away and not fade. */
  'aria-checked:not-data-[state]:shadow-outline data-[state]:shadow-transparent',
  'data-[state=right]:animate-mark-right data-[state=right]:bg-good-soft',
  'data-[state=retry]:animate-mark-retry data-[state=retry]:bg-attempted-soft',
)
const mark = cn(
  'gx-answer-option__mark grid size-[1.75rem] flex-none place-items-center rounded-full text-sm leading-figure font-control shadow-edge-strong transition-[background-color,color] duration-(--gx-dur-base) ease-standard',
  'group-aria-checked/option:shadow-none group-aria-checked/option:group-not-data-[state]/option:bg-ink group-aria-checked/option:group-not-data-[state]/option:text-white',
  'group-data-[state]/option:text-ink group-data-[state]/option:shadow-none',
  'group-data-[state=right]/option:bg-correct group-data-[state=retry]/option:bg-attempted',
)
const word =
  'gx-answer-option__word flex-none text-sm font-control group-data-[state=right]/option:text-good group-data-[state=retry]/option:text-attempted-ink'

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
    <div role="radiogroup" aria-label={label} aria-disabled={disabled || undefined} onKeyDown={onKeyDown} className={cn('gx-answer-group grid w-full grid-cols-[repeat(auto-fit,minmax(min(14.5rem,100%),1fr))] gap-2.5', className)}>
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
      className={cn(option, className)}
    >
      <span className={mark}>{state === 'right' ? <Icon name="check" size={16} /> : letter}</span>
      <span className="gx-answer-option__content min-w-0 flex-1">{children}</span>
      {state ? <span className={word}>{state === 'right' ? messages.correct : messages.notYet}</span> : null}
    </button>
  )
}

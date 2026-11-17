'use client'

import { cva } from 'class-variance-authority'
import { cn } from '../core/cn'
import { Icon } from '../core/Icon'
import { useLocale } from '../core/locale'
import type { Props } from '../core/props'
import { useControllable } from '../core/useControllable'
import { fieldBoxAround } from './Field.classes'
import { useField } from './Field'

export type NumberInputSize = 'md' | 'xl'
export type NumberInputProps = Props<
  'input',
  {
    value?: number | null
    defaultValue?: number | null
    onChange?: (value: number | null) => void
    min?: number
    max?: number
    step?: number
    size?: NumberInputSize
    label?: string
  },
  'type'
>

/* The box of a field, with a minus and a plus inside its ends. The browser's own arrows are hidden: the buttons replace them. */
const box = cva(['gx-number-input flex min-w-0 items-center bg-white shadow-edge-strong', fieldBoxAround], {
  variants: {
    /* xl has 16px text, so a phone does not zoom in on focus, and 44px buttons for a finger. */
    size: {
      md: 'gx-number-input--md h-(--gx-h-md) rounded-lg px-0.5 text-sm',
      xl: 'gx-number-input--xl h-(--gx-h-xl) rounded-2xl px-1 text-base',
    },
  },
})
const step = cva(
  'gx-number-input__step grid flex-none cursor-pointer place-items-center rounded-md text-muted outline-0 transition-[color,background-color] duration-(--gx-dur-fast) ease-standard enabled:hover:bg-surface enabled:hover:text-ink focus-visible:focus-ring focus-visible:-outline-offset-2 disabled:cursor-default disabled:opacity-50',
  {
    variants: {
      size: {
        md: 'size-[calc(var(--gx-h-md)-2*var(--gx-space-1))]',
        xl: 'size-[calc(var(--gx-h-xl)-2*var(--gx-space-2))] rounded-xl',
      },
    },
  },
)

/**
 * A whole number typed or stepped: a count of questions, a score out of. The value is `null` while the field is empty.
 * `value` is the number the product keeps; `defaultValue` when the field keeps its own. The arrow keys step by `step`.
 * Inside a `Field` it takes its label, hint and error from the Field; alone, `label` is its accessible name.
 * `className` goes to the box, every other prop and `ref` to the `<input>`.
 */
export function NumberInput({
  value: kept,
  defaultValue = null,
  onChange,
  min,
  max,
  step: by = 1,
  size = 'md',
  label,
  disabled,
  className,
  onBlur,
  ...props
}: NumberInputProps) {
  const { messages } = useLocale()
  const field = useField(label, props.id)
  const [value, set] = useControllable(kept, defaultValue, onChange)
  const clamp = (n: number) => Math.min(max ?? Infinity, Math.max(min ?? -Infinity, n))
  const move = (n: number) => set(clamp((value ?? min ?? 0) + n))
  return (
    <span className={cn(box({ size }), className)}>
      <button
        type="button"
        tabIndex={-1}
        aria-label={messages.decrease}
        disabled={disabled || (min !== undefined && value !== null && value <= min)}
        onClick={() => move(-by)}
        className={step({ size })}
      >
        <Icon name="minus" size={size === 'xl' ? 18 : 16} />
      </button>
      <input
        type="number"
        inputMode="numeric"
        {...field.props}
        min={min}
        max={max}
        step={by}
        disabled={disabled}
        {...props}
        value={value ?? ''}
        onChange={(event) => set(event.target.value === '' ? null : Number(event.target.value))}
        onBlur={(event) => {
          if (value !== null && clamp(value) !== value) set(clamp(value))
          onBlur?.(event)
        }}
        className="gx-number-input__control w-full min-w-0 appearance-none bg-transparent text-center tabular-nums outline-0 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      <button
        type="button"
        tabIndex={-1}
        aria-label={messages.increase}
        disabled={disabled || (max !== undefined && value !== null && value >= max)}
        onClick={() => move(by)}
        className={step({ size })}
      >
        <Icon name="plus" size={size === 'xl' ? 18 : 16} />
      </button>
    </span>
  )
}

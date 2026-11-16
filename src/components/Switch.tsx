'use client'

import { cn } from '../core/cn'
import type { Props } from '../core/props'
import { useControllable } from '../core/useControllable'

export type SwitchProps = Props<
  'button',
  {
    checked?: boolean
    defaultChecked?: boolean
    onChange?: (checked: boolean) => void
    label: string
    /** Sends `value` ("on" when left out) with a form while the switch is on, as a checkbox does. */
    name?: string
    value?: string
  },
  'children' | 'type' | 'role'
>

/**
 * 34×20 switch: ink when on, grey when off. `label` is its accessible name. `checked` is the state the product keeps;
 * `defaultChecked` when the switch keeps its own.
 */
export function Switch({ checked, defaultChecked = false, onChange, label, name, value = 'on', className, onClick, ...props }: SwitchProps) {
  const [on, set] = useControllable(checked, defaultChecked, onChange)
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      {...props}
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented) set(!on)
      }}
      className={cn(
        'gx-switch group relative block h-[1.25rem] w-[34px] flex-none rounded-xl bg-rule cursor-pointer outline-0 transition-colors duration-(--gx-dur-fast) ease-standard focus-visible:focus-ring focus-visible:outline-offset-2 aria-checked:bg-ink',
        className,
      )}
    >
      <span className="gx-switch__thumb absolute top-[0.125rem] left-[0.125rem] size-[1rem] rounded-full bg-white transition-[left] duration-(--gx-dur-fast) ease-standard group-aria-checked:left-[1rem]" />
      {name && on && !props.disabled ? <input type="hidden" name={name} value={value} /> : null}
    </button>
  )
}

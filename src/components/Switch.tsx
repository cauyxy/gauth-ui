import type { ComponentProps } from 'react'
import { cn } from '../core/cn'

/** 34×20 switch: ink when on, grey when off. `label` is its accessible name. */
export function Switch({
  checked,
  onChange,
  label,
  className,
  ...props
}: Omit<ComponentProps<'button'>, 'onChange' | 'onClick' | 'children'> & {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      {...props}
      onClick={() => onChange(!checked)}
      className={cn(
        'gx-switch group relative block h-[1.25rem] w-[34px] flex-none rounded-xl bg-rule cursor-pointer outline-0 transition-colors duration-(--gx-dur-fast) ease-standard focus-visible:focus-ring focus-visible:outline-offset-2 aria-checked:bg-ink',
        className,
      )}
    >
      <span className="gx-switch__thumb absolute top-[0.125rem] left-[0.125rem] size-[1rem] rounded-full bg-white transition-[left] duration-(--gx-dur-fast) ease-standard group-aria-checked:left-[1rem]" />
    </button>
  )
}

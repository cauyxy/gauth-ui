'use client'

import type { ReactNode } from 'react'
import { cn } from '../core/cn'
import { Icon } from '../core/Icon'
import type { Props } from '../core/props'

export type CheckboxProps = Props<
  'input',
  { checked?: boolean; defaultChecked?: boolean; onChange?: (checked: boolean) => void; label?: string; children?: ReactNode },
  'type'
>

/**
 * A yes or no for one item of a list. `children` are its visible text; with none, `label` is its accessible name.
 * `checked` is the answer the product keeps; `defaultChecked` when the box keeps its own. The native checkbox stays in
 * the page under an 18px box, so the keyboard and a form work as usual: `className` goes to the root, every other prop
 * (`name`, `value`, `required`, `disabled`) and `ref` to the `<input>`.
 */
export function Checkbox({ onChange, label, children, className, ...props }: CheckboxProps) {
  const Root = children ? 'label' : 'span'
  /* `items-start` and the `1lh` margins keep the box on the first line of the text, also when the text wraps. */
  return (
    <Root
      className={cn(
        'gx-checkbox relative inline-flex min-w-0 cursor-pointer items-start gap-2.5 text-sm has-disabled:cursor-default has-disabled:opacity-50',
        className,
      )}
    >
      {/* The native checkbox lies over the box and takes the click, the focus and the keyboard. */}
      <input
        type="checkbox"
        aria-label={label}
        {...props}
        onChange={onChange && ((event) => onChange(event.target.checked))}
        className="gx-checkbox__input peer absolute my-[calc((1lh-18px)/2)] size-[18px] cursor-[inherit] opacity-0"
      />
      {/* The edge is on the empty box only, so a checked box has no shadow at all and the edge fades out as before. */}
      <span className="gx-checkbox__box grid size-[18px] flex-none place-items-center my-[calc((1lh-18px)/2)] rounded-md text-white transition-[background-color,box-shadow] duration-(--gx-dur-fast) ease-standard peer-not-checked:shadow-box peer-checked:bg-ink peer-focus-visible:focus-ring peer-focus-visible:outline-offset-2 [&>svg]:opacity-0 peer-checked:[&>svg]:opacity-100">
        <Icon name="check" size={14} strokeWidth={2.6} />
      </span>
      {children ? <span className="gx-checkbox__text min-w-0">{children}</span> : null}
    </Root>
  )
}

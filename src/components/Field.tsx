'use client'

import { createContext, useContext, useId, type ReactNode } from 'react'
import { cn } from '../core/cn'
import type { Props } from '../core/props'

/** What a control gets from `useField`. */
export type FieldControl = {
  /** For the element that takes focus: its id, the hint or error that describes it, whether it is invalid, and outside a Field its name. */
  props: { id: string; 'aria-describedby'?: string; 'aria-invalid'?: true; 'aria-label'?: string }
  /** The id of what names the control: the Field's label, or outside a Field the control itself when it has a `label`. A control that adds its value to its name (`aria-labelledby`) starts with it. */
  labelId?: string
}

export type FieldProps = Props<'div', { label: string; hint?: ReactNode; error?: ReactNode; children: ReactNode }>

const FieldContext = createContext<{ id: string; labelId: string; describedBy?: string; invalid: boolean } | undefined>(undefined)
FieldContext.displayName = 'Field'

/**
 * Joins a control to the Field around it, or names it when there is none. Inside a Field, the Field's label names the
 * control, its hint or error describes it, and `label` is not used; outside one, `label` is its accessible name. `id` is
 * the product's own id for the control, if it gave one. The package's controls use it, and so can a product's own
 * control: spread `props` on the element that takes focus.
 */
export function useField(label?: string, id?: string): FieldControl {
  const field = useContext(FieldContext)
  const own = useId()
  const controlId = id ?? field?.id ?? own
  return {
    props: { id: controlId, 'aria-describedby': field?.describedBy, 'aria-invalid': field?.invalid || undefined, 'aria-label': field ? undefined : label },
    labelId: field ? field.labelId : label ? controlId : undefined,
  }
}

/**
 * A label above one control, with a hint or an error below it. The control gets its `id`, `aria-describedby` and
 * `aria-invalid` from the Field. An error replaces the hint.
 */
export function Field({ label, hint, error, children, className, ...props }: FieldProps) {
  const id = useId()
  const labelId = `${id}-label`
  const noteId = `${id}-note`
  const invalid = Boolean(error)
  const note = error || hint
  return (
    <div {...props} className={cn('gx-field flex min-w-0 flex-col gap-1.5', className)}>
      <label id={labelId} htmlFor={id} className="gx-field__label text-sm font-control">
        {label}
      </label>
      <FieldContext.Provider value={{ id, labelId, describedBy: note ? noteId : undefined, invalid }}>{children}</FieldContext.Provider>
      {/* attempted is the color of a field error. Nothing is red. */}
      {note ? (
        <span
          id={noteId}
          className={invalid ? 'gx-field__error text-xs font-control text-pretty text-attempted-ink' : 'gx-field__hint text-xs text-pretty text-muted'}
        >
          {note}
        </span>
      ) : null}
    </div>
  )
}

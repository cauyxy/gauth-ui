'use client'

import { createContext, useContext, useId, type ReactNode } from 'react'
import { cn } from '../core/cn'
import type { Props } from '../core/props'

/** What a Field gives the control inside it. */
export type FieldControl = { id: string; labelId: string; describedBy?: string; invalid: boolean }

export type FieldProps = Props<'div', { label: string; hint?: ReactNode; error?: ReactNode; children: ReactNode }>

const FieldContext = createContext<FieldControl | undefined>(undefined)
FieldContext.displayName = 'Field'

/**
 * The Field around a control, or nothing when there is none. The package's own controls read it, and so can a
 * product's control: give the control `id`, `aria-describedby` and `aria-invalid` from it.
 */
export const useField = () => useContext(FieldContext)

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

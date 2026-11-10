import { createContext, useContext, useId, type ReactNode } from 'react'
import { cx } from '../core/cx'

/** What a Field gives the control inside it. */
export type FieldControl = { id: string; describedBy?: string; invalid: boolean }

const FieldContext = createContext<FieldControl | undefined>(undefined)

/** The Field around a control, or nothing when there is none. `Input`, `Textarea` and `Select` read it. */
export const useField = () => useContext(FieldContext)

/**
 * A label above one control, with a hint or an error below it. The control gets its `id`, `aria-describedby` and
 * `aria-invalid` from the Field. An error replaces the hint.
 */
export function Field({
  label,
  hint,
  error,
  children,
  className,
}: {
  label: string
  hint?: ReactNode
  error?: ReactNode
  children: ReactNode
  className?: string
}) {
  const id = useId()
  const noteId = `${id}-note`
  const invalid = Boolean(error)
  const note = error || hint
  return (
    <div className={cx('gx-field', className)}>
      <label htmlFor={id} className="gx-field__label">
        {label}
      </label>
      <FieldContext.Provider value={{ id, describedBy: note ? noteId : undefined, invalid }}>{children}</FieldContext.Provider>
      {note ? (
        <span id={noteId} className={invalid ? 'gx-field__error' : 'gx-field__hint'}>
          {note}
        </span>
      ) : null}
    </div>
  )
}

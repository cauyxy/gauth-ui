import type { ComponentProps, CSSProperties, ReactNode } from 'react'
import { cx } from '../core/cx'

/**
 * Rows of the same kind of thing, in columns. `columns` is a `grid-template-columns` value that every row uses: each
 * row is its own grid, so give fixed or `fr` widths, not `auto`. `label` is the table's accessible name.
 */
export function Table({ columns, label, children, className }: { columns: string; label: string; children: ReactNode; className?: string }) {
  return (
    <div role="table" aria-label={label} className={cx('gx-table', className)} style={{ '--gx-table-columns': columns } as CSSProperties}>
      {children}
    </div>
  )
}

/** The row of column heads. Its cells are `<TableCell head>`. */
export function TableHead({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div role="row" className={cx('gx-table__head', className)}>
      {children}
    </div>
  )
}

export function TableRow({ className, ...props }: ComponentProps<'div'>) {
  return <div role="row" className={cx('gx-table__row', className)} {...props} />
}

/** One cell. Long text is cut with an ellipsis. `align="end"` is for a number or the row's action. */
export function TableCell({
  children,
  head = false,
  align = 'start',
  className,
}: {
  children?: ReactNode
  head?: boolean
  align?: 'start' | 'end'
  className?: string
}) {
  return (
    <div role={head ? 'columnheader' : 'cell'} className={cx('gx-table__cell', align === 'end' && 'gx-table__cell--end', className)}>
      {children}
    </div>
  )
}

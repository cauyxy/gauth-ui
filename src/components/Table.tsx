import type { ComponentProps, CSSProperties, ReactNode } from 'react'
import { cn } from '../core/cn'

/* The head and each row are the same grid. `--gx-table-columns` is set by the `columns` prop. */
const line = 'grid grid-cols-(--gx-table-columns) items-center gap-4 border-b border-line px-5'

/**
 * Rows of the same kind of thing, in columns. `columns` is a `grid-template-columns` value that every row uses: each
 * row is its own grid, so give fixed or `fr` widths, not `auto`. `label` is the table's accessible name.
 */
export function Table({ columns, label, children, className }: { columns: string; label: string; children: ReactNode; className?: string }) {
  return (
    <div
      role="table"
      aria-label={label}
      className={cn('gx-table w-full [--gx-table-columns:repeat(auto-fit,minmax(0,1fr))]', className)}
      style={{ '--gx-table-columns': columns } as CSSProperties}
    >
      {children}
    </div>
  )
}

/** The row of column heads. Its cells are `<TableCell head>`. */
export function TableHead({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div role="row" className={cn('gx-table__head', line, 'min-h-[36px] text-2xs font-control tracking-label text-muted uppercase', className)}>
      {children}
    </div>
  )
}

export function TableRow({ className, ...props }: ComponentProps<'div'>) {
  return <div role="row" className={cn('gx-table__row', line, 'min-h-[56px] text-sm font-control text-ink last:border-b-0', className)} {...props} />
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
    <div
      role={head ? 'columnheader' : 'cell'}
      className={cn(
        /* The cell cuts long text. Its padding, taken back by the margin, leaves room for the focus ring of a button inside. */
        'gx-table__cell -m-1 min-w-0 overflow-hidden p-1 text-ellipsis whitespace-nowrap',
        align === 'end' && 'gx-table__cell--end text-end tabular-nums',
        className,
      )}
    >
      {children}
    </div>
  )
}

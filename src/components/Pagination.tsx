'use client'

import { cn } from '../core/cn'
import { Icon } from '../core/Icon'
import { useLocale } from '../core/locale'
import type { Props } from '../core/props'
import { IconButton } from './IconButton'
import { pagesOf } from './Pagination.pages'

export type PaginationProps = Props<'nav', { page: number; count: number; onChange: (page: number) => void }, 'children'>

/**
 * The pages of a long list: back, the page numbers, forward. `page` counts from 1; `onChange` gets the new page.
 * It is a `nav` named "Pages"; the current page has `aria-current="page"`.
 */
export function Pagination({ page, count, onChange, className, ...props }: PaginationProps) {
  const { messages } = useLocale()
  if (count <= 1) return null
  return (
    <nav aria-label={messages.pagination} {...props} className={cn('gx-pagination flex items-center gap-1', className)}>
      <IconButton label={messages.previousPage} size="sm" disabled={page <= 1} onClick={() => onChange(page - 1)}>
        <Icon name="chevron-left" />
      </IconButton>
      <ol className="gx-pagination__pages flex items-center gap-1">
        {pagesOf(page, count).map((n, i) => (
          <li key={n ?? `skip${i}`} className="flex">
            {n === null ? (
              <span aria-hidden="true" className="gx-pagination__gap grid h-(--gx-h-sm) w-6 place-items-center text-sm text-muted">
                …
              </span>
            ) : (
              /* The current page has the ink ring of a picked item, not a fill: the one ink button in the view stays the page's main action. */
              <button
                type="button"
                aria-label={messages.page(n)}
                aria-current={n === page ? 'page' : undefined}
                onClick={() => onChange(n)}
                className="gx-pagination__page grid h-(--gx-h-sm) min-w-(--gx-h-sm) cursor-pointer place-items-center rounded-lg px-1.5 text-sm font-control text-muted tabular-nums outline-0 transition-[color,background-color] duration-(--gx-dur-fast) ease-standard hover:bg-surface hover:text-ink focus-visible:focus-ring focus-visible:outline-offset-2 aria-[current=page]:text-ink aria-[current=page]:shadow-outline"
              >
                {n}
              </button>
            )}
          </li>
        ))}
      </ol>
      <IconButton label={messages.nextPage} size="sm" disabled={page >= count} onClick={() => onChange(page + 1)}>
        <Icon name="chevron-right" />
      </IconButton>
    </nav>
  )
}

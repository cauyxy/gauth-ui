import type { CSSProperties } from 'react'
import { cn } from '../core/cn'
import { useLocale } from '../core/locale'

/** A grey block standing in for content that is still loading. Give it a size with `className` or `style`. */
export function Skeleton({ className, style }: { className?: string; style?: CSSProperties }) {
  return <span aria-hidden="true" className={cn('gx-skeleton block animate-pulse rounded-lg bg-ink/7', className)} style={style} />
}

/**
 * A page's body while its data loads: a title, then panels of rows, so the page takes its shape at once instead of
 * reading "Loading…". It fades in after 150 ms, so a page whose data is already on the way never flashes it.
 */
export function PageSkeleton({ panels = 2, rows = 3, label, className }: { panels?: number; rows?: number; label?: string; className?: string }) {
  const { messages } = useLocale()
  return (
    <div
      role="status"
      aria-label={label ?? messages.loading}
      className={cn('gx-page-skeleton flex animate-fade-in flex-col gap-5 [animation-delay:var(--gx-delay-loading)]', className)}
    >
      <span className="gx-page-skeleton__title flex flex-col gap-2.5">
        <Skeleton style={{ height: '2rem', width: 'min(340px, 70%)' }} />
        <Skeleton style={{ height: '1rem', width: 'min(220px, 50%)' }} />
      </span>
      {[...Array(panels).keys()].map((p) => (
        <section key={p} className="gx-page-skeleton__panel flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-edge">
          <Skeleton style={{ height: '1rem', width: '8rem' }} />
          {[...Array(rows).keys()].map((r) => (
            <span key={r} className="gx-page-skeleton__row flex items-center gap-3">
              <Skeleton className="gx-page-skeleton__dot size-9 flex-none rounded-full" />
              <span className="gx-page-skeleton__lines flex flex-1 flex-col gap-2">
                <Skeleton style={{ height: '0.875rem', width: '60%' }} />
                <Skeleton style={{ height: '0.75rem', width: '35%' }} />
              </span>
            </span>
          ))}
        </section>
      ))}
    </div>
  )
}
